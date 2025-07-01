import { Request, Response, Router } from 'express';
import { db } from '../db';
import { z } from 'zod';
import { transactions, budgets, Transaction, Budget } from '@shared/schema';

const router = Router();

// Schema for transaction
const transactionSchema = z.object({
  amount: z.string().refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0),
  category: z.string().min(1),
  description: z.string().min(3),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.string().min(1),
  department: z.string().min(1),
  budgetLine: z.string().optional(),
  recipient: z.string().optional(),
});

// Schema for budget
const budgetSchema = z.object({
  name: z.string().min(3),
  amount: z.string().refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0),
  startDate: z.date(),
  endDate: z.date(),
  category: z.string().min(1),
  department: z.string().min(1),
  description: z.string().optional(),
});

// Get all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    
    let allTransactions = await db.query.transactions.findMany({
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
    });
    
    // Filter by department if specified
    if (department && department !== 'all') {
      allTransactions = allTransactions.filter(t => t.department === department);
    }
    
    return res.status(200).json(allTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const data = transactionSchema.parse(req.body);
    
    const newTransaction = await db.insert(transactions).values({
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
      type: data.type,
      paymentMethod: data.paymentMethod,
      department: data.department,
      budgetLine: data.budgetLine || null,
      recipient: data.recipient || null,
    }).returning();
    
    return res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get all budgets
router.get('/budgets', async (req: Request, res: Response) => {
  try {
    const allBudgets = await db.query.budgets.findMany({
      orderBy: (budgets, { desc }) => [desc(budgets.startDate)],
    });
    
    return res.status(200).json(allBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create a new budget
router.post('/budgets', async (req: Request, res: Response) => {
  try {
    const data = budgetSchema.parse(req.body);
    
    const newBudget = await db.insert(budgets).values({
      name: data.name,
      amount: data.amount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      category: data.category,
      department: data.department,
      description: data.description || null,
    }).returning();
    
    return res.status(201).json(newBudget[0]);
  } catch (error) {
    console.error('Error creating budget:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Get financial summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    // Get transactions
    const allTransactions = await db.query.transactions.findMany();
    const allBudgets = await db.query.budgets.findMany();
    
    // Current date for calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate total income and expenses for current month
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Previous month calculations
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === prevMonth && 
             transactionDate.getFullYear() === prevMonthYear;
    });
    
    const prevMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const prevMonthExpenses = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Calculate percentage change
    const incomeChange = prevMonthIncome === 0 
      ? 100 
      : Math.round(((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100);
      
    const expenseChange = prevMonthExpenses === 0 
      ? 100 
      : Math.round(((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100);
    
    // Get total budget and spent
    const totalBudget = allBudgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
    
    const totalSpent = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Generate department summary
    const departments = [
      { id: 'admin', name: 'Administration' },
      { id: 'faculty', name: 'Faculty' },
      { id: 'superhero', name: 'Superhero School' },
      { id: 'law', name: 'Law School' },
      { id: 'language', name: 'Language School' },
      { id: 'it', name: 'IT Department' },
      { id: 'facilities', name: 'Facilities' },
      { id: 'studentServices', name: 'Student Services' },
    ];
    
    const departmentSummary = departments.map(dept => {
      // Get budgets for this department
      const deptBudgets = allBudgets.filter(b => b.department === dept.id);
      const deptBudgetTotal = deptBudgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
      
      // Get expenses for this department
      const deptExpenses = allTransactions
        .filter(t => t.department === dept.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      return {
        department: dept.id,
        name: dept.name,
        budget: deptBudgetTotal,
        spent: deptExpenses,
        remaining: deptBudgetTotal - deptExpenses,
      };
    });
    
    // Generate category summary
    const categories = [
      { id: 'salary', name: 'Salary & Benefits' },
      { id: 'equipment', name: 'Equipment & Supplies' },
      { id: 'curriculum', name: 'Curriculum & Materials' },
      { id: 'facilities', name: 'Facilities & Maintenance' },
      { id: 'professional', name: 'Professional Development' },
      { id: 'technology', name: 'Technology' },
      { id: 'transportation', name: 'Transportation' },
      { id: 'events', name: 'Events & Activities' },
      { id: 'admin', name: 'Administrative' },
      { id: 'other', name: 'Other' },
    ];
    
    const categorySummary = categories.map(cat => {
      // Get budgets for this category
      const catBudgets = allBudgets.filter(b => b.category === cat.id);
      const catBudgetTotal = catBudgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
      
      // Get expenses for this category
      const catExpenses = allTransactions
        .filter(t => t.category === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      return {
        category: cat.id,
        name: cat.name,
        budget: catBudgetTotal,
        spent: catExpenses,
        remaining: catBudgetTotal - catExpenses,
      };
    });
    
    // Get recent transactions (last 5)
    const recentTransactions = [...allTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    // Prepare response
    const summary = {
      totalBudget,
      totalSpent,
      currentMonthIncome,
      currentMonthExpenses,
      incomeChange,
      expenseChange,
      departmentSummary,
      categorySummary,
      recentTransactions,
    };
    
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating financial summary:', error);
    return res.status(500).json({ error: 'Failed to generate financial summary' });
  }
});

export default router;