from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from courses.models import Course
from users.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_view(request):
    """
    Universal search endpoint for courses, training programs, and users
    Query parameter: q (search query)
    Returns: List of results with type, id, title, description, category
    """
    query = request.GET.get('q', '').strip()
    
    if not query or len(query) < 2:
        return Response({'results': []})
    
    results = []
    
    # Search courses
    courses = Course.objects.filter(
        Q(title__icontains=query) | 
        Q(description__icontains=query) |
        Q(category__icontains=query)
    ).order_by('-created_at')[:10]
    
    for course in courses:
        results.append({
            'id': course.id,
            'type': 'course',
            'title': course.title,
            'description': course.description[:150] if course.description else '',
            'category': course.category or 'Course',
            'url': f'/courses/{course.id}'
        })
    
    # Add training-specific results if you have a Training model
    # training_programs = TrainingProgram.objects.filter(...)
    
    return Response({
        'results': results,
        'query': query,
        'total': len(results)
    })
