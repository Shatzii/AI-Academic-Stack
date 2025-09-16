"""
AI-Powered Curriculum Converter
Converts documents, PDFs, and other content into structured educational curriculum
"""

import os
import re
import json
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
import logging
from dataclasses import dataclass, asdict

import torch
from transformers import (
    AutoTokenizer, AutoModelForSeq2SeqLM, pipeline,
    AutoModelForTokenClassification, AutoTokenizer as NERTokenizer
)
import PyPDF2
import docx
from PIL import Image
import pytesseract
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

logger = logging.getLogger(__name__)

@dataclass
class CurriculumSection:
    """Represents a section of curriculum content"""
    title: str
    content: str
    learning_objectives: List[str]
    key_concepts: List[str]
    difficulty_level: str
    estimated_time: int  # minutes
    prerequisites: List[str]
    assessment_questions: List[str]

@dataclass
class CurriculumMetadata:
    """Metadata for the entire curriculum"""
    title: str
    subject: str
    grade_level: str
    description: str
    total_sections: int
    estimated_duration: int  # minutes
    learning_outcomes: List[str]
    prerequisites: List[str]

class CurriculumConverter:
    """AI-powered curriculum converter"""

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # Initialize NLP models
        self.summarizer = None
        self.ner_model = None
        self.ner_tokenizer = None

        # Download NLTK data
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
        except:
            pass

        self._load_models()

    def _load_models(self):
        """Load required AI models"""
        try:
            # Summarization model
            logger.info("Loading summarization model...")
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if self.device == "cuda" else -1
            )

            # NER model for concept extraction
            logger.info("Loading NER model...")
            ner_model_name = "dbmdz/bert-large-cased-finetuned-conll03-english"
            self.ner_tokenizer = NERTokenizer.from_pretrained(ner_model_name)
            self.ner_model = AutoModelForTokenClassification.from_pretrained(ner_model_name)
            if self.device == "cuda":
                self.ner_model = self.ner_model.to(self.device)

            logger.info("Models loaded successfully")

        except Exception as e:
            logger.error(f"Failed to load models: {e}")

    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from various file formats"""
        file_extension = Path(file_path).suffix.lower()

        try:
            if file_extension == '.pdf':
                return self._extract_from_pdf(file_path)
            elif file_extension in ['.docx', '.doc']:
                return self._extract_from_docx(file_path)
            elif file_extension == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            elif file_extension in ['.jpg', '.jpeg', '.png', '.bmp']:
                return self._extract_from_image(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")

        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {e}")
            return ""

    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF files"""
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text

    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from Word documents"""
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text

    def _extract_from_image(self, file_path: str) -> str:
        """Extract text from images using OCR"""
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            logger.error(f"OCR failed for {file_path}: {e}")
            return ""

    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess extracted text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)

        # Remove page numbers and headers/footers (common patterns)
        text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
        text = re.sub(r'Page \d+', '', text)

        # Basic cleaning
        text = text.strip()

        return text

    def extract_key_concepts(self, text: str) -> List[str]:
        """Extract key concepts using NER and TF-IDF"""
        concepts = []

        # Use NER to find named entities
        if self.ner_model and self.ner_tokenizer:
            concepts.extend(self._extract_named_entities(text))

        # Use TF-IDF for important terms
        tfidf_concepts = self._extract_tfidf_concepts(text)
        concepts.extend(tfidf_concepts)

        # Remove duplicates and filter
        concepts = list(set(concepts))
        concepts = [c for c in concepts if len(c) > 2 and not c.isdigit()]

        return concepts[:20]  # Limit to top 20 concepts

    def _extract_named_entities(self, text: str) -> List[str]:
        """Extract named entities using BERT NER"""
        try:
            inputs = self.ner_tokenizer(text[:512], return_tensors="pt", truncation=True)
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self.ner_model(**inputs)

            predictions = torch.argmax(outputs.logits, dim=2)
            predicted_labels = [self.ner_model.config.id2label[p.item()] for p in predictions[0]]

            # Extract entities
            entities = []
            current_entity = ""
            current_label = ""

            for token, label in zip(self.ner_tokenizer.convert_ids_to_tokens(inputs["input_ids"][0]), predicted_labels):
                if label.startswith("B-"):
                    if current_entity:
                        entities.append(current_entity.strip())
                    current_entity = token
                    current_label = label[2:]
                elif label.startswith("I-") and current_label == label[2:]:
                    current_entity += " " + token
                elif label == "O":
                    if current_entity:
                        entities.append(current_entity.strip())
                        current_entity = ""

            if current_entity:
                entities.append(current_entity.strip())

            return entities

        except Exception as e:
            logger.error(f"NER extraction failed: {e}")
            return []

    def _extract_tfidf_concepts(self, text: str) -> List[str]:
        """Extract important concepts using TF-IDF"""
        try:
            # Tokenize into sentences
            sentences = sent_tokenize(text)

            if len(sentences) < 2:
                return []

            # Create TF-IDF vectorizer
            stop_words = set(stopwords.words('english'))
            vectorizer = TfidfVectorizer(stop_words=list(stop_words), max_features=50)
            tfidf_matrix = vectorizer.fit_transform(sentences)

            # Get feature names and scores
            feature_names = vectorizer.get_feature_names_out()
            scores = np.sum(tfidf_matrix.toarray(), axis=0)

            # Sort by importance
            sorted_indices = np.argsort(scores)[::-1]
            top_concepts = [feature_names[i] for i in sorted_indices[:15]]

            return top_concepts

        except Exception as e:
            logger.error(f"TF-IDF extraction failed: {e}")
            return []

    def generate_learning_objectives(self, content: str, concepts: List[str]) -> List[str]:
        """Generate learning objectives from content and concepts"""
        objectives = []

        # Template-based objective generation
        templates = [
            "Understand the concept of {concept}",
            "Explain how {concept} relates to {related_concept}",
            "Apply {concept} to solve problems",
            "Analyze the components of {concept}",
            "Evaluate the importance of {concept} in {context}"
        ]

        # Generate objectives for key concepts
        for i, concept in enumerate(concepts[:5]):
            template = templates[i % len(templates)]

            # Try to find related concepts
            related = concepts[i+1] if i+1 < len(concepts) else concepts[0]
            context = "the subject matter"  # Could be enhanced with more context

            objective = template.format(
                concept=concept,
                related_concept=related,
                context=context
            )
            objectives.append(objective)

        return objectives

    def estimate_difficulty_and_time(self, content: str, concepts: List[str]) -> Tuple[str, int]:
        """Estimate difficulty level and time required"""
        word_count = len(word_tokenize(content))
        concept_count = len(concepts)

        # Simple heuristic for difficulty
        if concept_count > 15 or word_count > 2000:
            difficulty = "Advanced"
            time_estimate = 90
        elif concept_count > 8 or word_count > 1000:
            difficulty = "Intermediate"
            time_estimate = 60
        else:
            difficulty = "Beginner"
            time_estimate = 30

        return difficulty, time_estimate

    def generate_assessment_questions(self, content: str, concepts: List[str]) -> List[str]:
        """Generate assessment questions"""
        questions = []

        # Simple question templates
        question_templates = [
            "What is {concept}?",
            "Explain the importance of {concept}.",
            "How does {concept} work?",
            "What are the key components of {concept}?",
            "Give an example of {concept}."
        ]

        for concept in concepts[:5]:
            template = question_templates[len(questions) % len(question_templates)]
            question = template.format(concept=concept)
            questions.append(question)

        return questions

    def segment_content(self, text: str) -> List[Dict[str, Any]]:
        """Segment content into logical sections"""
        # Split by common section headers
        sections = re.split(r'(?=^[A-Z][^a-z]*$)', text, flags=re.MULTILINE)

        # Filter out very short sections
        sections = [s.strip() for s in sections if len(s.strip()) > 100]

        segmented_content = []
        for i, section in enumerate(sections):
            title = f"Section {i+1}" if i > 0 else "Introduction"

            # Try to extract a better title from the first line
            lines = section.split('\n')
            if lines and len(lines[0]) < 100:
                title = lines[0].strip()

            segmented_content.append({
                'title': title,
                'content': section,
                'order': i
            })

        return segmented_content

    def convert_to_curriculum(self, file_path: str) -> Dict[str, Any]:
        """Main conversion function"""
        try:
            # Extract and preprocess text
            raw_text = self.extract_text_from_file(file_path)
            if not raw_text:
                raise ValueError("Could not extract text from file")

            processed_text = self.preprocess_text(raw_text)

            # Segment content
            sections_data = self.segment_content(processed_text)

            # Extract key concepts from entire document
            key_concepts = self.extract_key_concepts(processed_text)

            # Generate metadata
            title = Path(file_path).stem.replace('_', ' ').title()
            metadata = CurriculumMetadata(
                title=title,
                subject="General",  # Could be enhanced with classification
                grade_level="General",
                description=self._generate_description(processed_text),
                total_sections=len(sections_data),
                estimated_duration=sum(self.estimate_difficulty_and_time(s['content'], key_concepts)[1] for s in sections_data),
                learning_outcomes=self.generate_learning_objectives(processed_text, key_concepts),
                prerequisites=[]
            )

            # Convert sections
            sections = []
            for section_data in sections_data:
                concepts = self.extract_key_concepts(section_data['content'])
                difficulty, time_estimate = self.estimate_difficulty_and_time(section_data['content'], concepts)

                section = CurriculumSection(
                    title=section_data['title'],
                    content=section_data['content'],
                    learning_objectives=self.generate_learning_objectives(section_data['content'], concepts),
                    key_concepts=concepts,
                    difficulty_level=difficulty,
                    estimated_time=time_estimate,
                    prerequisites=[],
                    assessment_questions=self.generate_assessment_questions(section_data['content'], concepts)
                )

                sections.append(asdict(section))

            return {
                'metadata': asdict(metadata),
                'sections': sections,
                'source_file': file_path,
                'processing_stats': {
                    'total_words': len(word_tokenize(processed_text)),
                    'total_concepts': len(key_concepts),
                    'sections_count': len(sections)
                }
            }

        except Exception as e:
            logger.error(f"Curriculum conversion failed: {e}")
            return {'error': str(e)}

    def _generate_description(self, text: str) -> str:
        """Generate a description using summarization"""
        try:
            if self.summarizer and len(text) > 100:
                # Take first 1000 characters for summarization
                summary_text = text[:1000]
                summary = self.summarizer(summary_text, max_length=50, min_length=10, do_sample=False)
                return summary[0]['summary_text']
            else:
                # Fallback: extract first sentence
                sentences = sent_tokenize(text)
                return sentences[0] if sentences else "Educational content"
        except Exception as e:
            logger.error(f"Description generation failed: {e}")
            return "Educational content covering key concepts and topics"