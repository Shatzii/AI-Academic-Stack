import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db";
import { insertUserSchema, users } from "../../shared/schema";
import { parentChildRelationships, insertParentChildRelationshipSchema } from "../../shared/schema";
import { curriculumPlans, insertCurriculumPlanSchema } from "../../shared/schema";
import { learningSchedules, insertLearningScheduleSchema } from "../../shared/schema";

export const router = Router();

// Parent registration route
router.post('/register/parent', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      username: z.string().min(3),
      password: z.string().min(8),
      email: z.string().email(),
      full_name: z.string().min(3),
      phone_number: z.string().optional(),
      role: z.literal("parent")
    });

    const validatedData = schema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, or }) => or(
        eq(users.username, validatedData.username),
        eq(users.email, validatedData.email)
      )
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: "User already exists", 
        message: "A user with this username or email already exists."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const userData = {
      username: validatedData.username,
      password: hashedPassword,
      email: validatedData.email,
      full_name: validatedData.full_name,
      phone_number: validatedData.phone_number || "",
      role: validatedData.role,
      avatarType: "explorer" as const, // Default avatar
      level: 1,
      xp: 0,
      mood: "happy" as const,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await db.insert(users).values(userData).returning();
    
    if (!insertResult || insertResult.length === 0) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const user = insertResult[0];
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json({ 
      message: "Parent account created successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Parent registration error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred during registration."
    });
  }
});

// Add child to parent account
router.post('/parent/add-child', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      parentId: z.number(),
      childData: z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        full_name: z.string().min(3),
        age: z.number().min(4).max(18),
        grade: z.string(),
        neurodivergent: z.boolean().optional(),
        neurodivergenceType: z.string().optional(),
        interests: z.array(z.string()).optional()
      })
    });

    const validatedData = schema.parse(req.body);
    
    // Check if parent exists
    const parent = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, validatedData.parentId)
    });

    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ error: "Parent not found" });
    }

    // Check if child username already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, validatedData.childData.username)
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.childData.password, salt);

    // Create child user
    const childData = {
      username: validatedData.childData.username,
      password: hashedPassword,
      email: "", // Children don't need emails
      full_name: validatedData.childData.full_name,
      role: "student" as const,
      avatarType: "explorer" as const, // Default avatar
      level: 1,
      xp: 0,
      mood: "happy" as const,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: JSON.stringify({
        age: validatedData.childData.age,
        grade: validatedData.childData.grade,
        neurodivergent: validatedData.childData.neurodivergent || false,
        neurodivergenceType: validatedData.childData.neurodivergenceType || "",
        interests: validatedData.childData.interests || []
      })
    };

    // Insert child user
    const insertResult = await db.insert(users).values(childData).returning();
    
    if (!insertResult || insertResult.length === 0) {
      return res.status(500).json({ error: "Failed to create child account" });
    }

    const child = insertResult[0];

    // Create parent-child relationship
    const relationshipData = {
      parentId: validatedData.parentId,
      childId: child.id,
      relationshipType: "parent-child",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(parentChildRelationships).values(relationshipData);

    // Return child data without password
    const { password, ...childWithoutPassword } = child;
    
    res.status(201).json({
      message: "Child account created successfully",
      child: childWithoutPassword
    });

  } catch (error) {
    console.error("Add child error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while adding the child."
    });
  }
});

// Get parent's children
router.get('/parent/:parentId/children', async (req: Request, res: Response) => {
  try {
    const parentId = parseInt(req.params.parentId);
    
    if (isNaN(parentId)) {
      return res.status(400).json({ error: "Invalid parent ID" });
    }

    // Check if parent exists
    const parent = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, parentId)
    });

    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ error: "Parent not found" });
    }

    // Get parent-child relationships
    const relationships = await db.query.parentChildRelationships.findMany({
      where: (parentChildRelationships, { eq }) => eq(parentChildRelationships.parentId, parentId)
    });

    // Get children data
    const childrenData = await Promise.all(
      relationships.map(async (rel) => {
        const child = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, rel.childId)
        });

        if (!child) return null;

        // Remove password
        const { password, ...childWithoutPassword } = child;
        
        // Parse metadata
        let metadata = {};
        try {
          if (child.metadata) {
            metadata = JSON.parse(child.metadata as string);
          }
        } catch (e) {
          console.error("Error parsing child metadata:", e);
        }

        return {
          ...childWithoutPassword,
          ...metadata
        };
      })
    );

    // Filter out nulls
    const children = childrenData.filter(Boolean);
    
    res.status(200).json({
      children
    });

  } catch (error) {
    console.error("Get children error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while retrieving children data."
    });
  }
});

// Update child information
router.patch('/child/:childId', async (req: Request, res: Response) => {
  try {
    const childId = parseInt(req.params.childId);
    
    if (isNaN(childId)) {
      return res.status(400).json({ error: "Invalid child ID" });
    }

    // Check if child exists
    const child = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, childId)
    });

    if (!child || child.role !== 'student') {
      return res.status(404).json({ error: "Child not found" });
    }

    // Parse existing metadata
    let metadata = {};
    try {
      if (child.metadata) {
        metadata = JSON.parse(child.metadata as string);
      }
    } catch (e) {
      console.error("Error parsing child metadata:", e);
    }

    // Update user data with new values
    const updatedData = {
      ...req.body,
      metadata: JSON.stringify({
        ...metadata,
        ...req.body.metadata
      }),
      updatedAt: new Date()
    };

    // Remove metadata from main body if it exists
    if (updatedData.metadata) {
      delete updatedData.metadata;
    }

    // Update child record
    await db.update(users)
      .set(updatedData)
      .where(({ id }) => id.equals(childId));

    res.status(200).json({
      message: "Child information updated successfully"
    });

  } catch (error) {
    console.error("Update child error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while updating the child information."
    });
  }
});

// Create curriculum plan
router.post('/parent/curriculum-plan', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      parentId: z.number(),
      childId: z.number(),
      name: z.string(),
      description: z.string(),
      schoolType: z.string(),
      gradeLevel: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      goals: z.array(z.string()),
      subjects: z.array(z.string())
    });

    const validatedData = schema.parse(req.body);
    
    // Check if parent exists
    const parent = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, validatedData.parentId)
    });

    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ error: "Parent not found" });
    }

    // Check if child exists
    const child = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, validatedData.childId)
    });

    if (!child || child.role !== 'student') {
      return res.status(404).json({ error: "Child not found" });
    }

    // Create curriculum plan
    const planData = {
      parentId: validatedData.parentId,
      childId: validatedData.childId,
      name: validatedData.name,
      description: validatedData.description,
      schoolType: validatedData.schoolType,
      gradeLevel: validatedData.gradeLevel,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      goals: JSON.stringify(validatedData.goals),
      subjects: JSON.stringify(validatedData.subjects),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await db.insert(curriculumPlans).values(planData).returning();
    
    if (!insertResult || insertResult.length === 0) {
      return res.status(500).json({ error: "Failed to create curriculum plan" });
    }

    const plan = insertResult[0];
    
    res.status(201).json({
      message: "Curriculum plan created successfully",
      plan
    });

  } catch (error) {
    console.error("Create curriculum plan error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while creating the curriculum plan."
    });
  }
});

// Get child's schedule
router.get('/child/:childId/schedule', async (req: Request, res: Response) => {
  try {
    const childId = parseInt(req.params.childId);
    
    if (isNaN(childId)) {
      return res.status(400).json({ error: "Invalid child ID" });
    }

    // Check if child exists
    const child = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, childId)
    });

    if (!child || child.role !== 'student') {
      return res.status(404).json({ error: "Child not found" });
    }

    // Get learning schedules for the child
    const schedules = await db.query.learningSchedules.findMany({
      where: (learningSchedules, { eq }) => eq(learningSchedules.childId, childId)
    });
    
    res.status(200).json({
      schedules
    });

  } catch (error) {
    console.error("Get schedule error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while retrieving the schedule."
    });
  }
});

// Create learning schedule
router.post('/child/schedule', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      childId: z.number(),
      curriculumPlanId: z.number(),
      day: z.string(),
      title: z.string(),
      subject: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      description: z.string().optional(),
      resourceLinks: z.array(z.string()).optional()
    });

    const validatedData = schema.parse(req.body);
    
    // Check if child exists
    const child = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, validatedData.childId)
    });

    if (!child || child.role !== 'student') {
      return res.status(404).json({ error: "Child not found" });
    }

    // Create schedule item
    const scheduleData = {
      childId: validatedData.childId,
      curriculumPlanId: validatedData.curriculumPlanId,
      day: validatedData.day,
      title: validatedData.title,
      subject: validatedData.subject,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      description: validatedData.description || "",
      resourceLinks: JSON.stringify(validatedData.resourceLinks || []),
      progress: 0,
      completed: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await db.insert(learningSchedules).values(scheduleData).returning();
    
    if (!insertResult || insertResult.length === 0) {
      return res.status(500).json({ error: "Failed to create schedule item" });
    }

    const schedule = insertResult[0];
    
    res.status(201).json({
      message: "Schedule item created successfully",
      schedule
    });

  } catch (error) {
    console.error("Create schedule error:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: "An error occurred while creating the schedule item."
    });
  }
});