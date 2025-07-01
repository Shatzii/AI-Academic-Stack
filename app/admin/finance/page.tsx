'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  // Sample financial data
  const accounts = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      studentId: 'STU-2025-001',
      accountType: 'tuition',
      balance: -2850.00,
      creditLimit: 0,
      lastPayment: '2025-01-15',
      paymentAmount: 950.00,
      status: 'past_due',
      dueDate: '2025-01-01'
    },
    {
      id: '2',
      studentName: 'Marcus Williams',
      studentId: 'STU-2025-002',
      accountType: 'tuition',
      balance: 0.00,
      creditLimit: 0,
      lastPayment: '2024-12-28',
      paymentAmount: 3800.00,
      status: 'current',
      dueDate: '2025-02-01'
    },
    {
      id: '3',
      studentName: 'Sophia Rodriguez',
      studentId: 'STU-2025-003',
      accountType: 'lunch',
      balance: -45.75,
      creditLimit: 50.00,
      lastPayment: '2025-01-20',
      paymentAmount: 25.00,
      status: 'low_balance',
      dueDate: null
    }
  ]

  const transactions = [
    {
      id: '1',
      accountId: '1',
      studentName: 'Emma Johnson',
      type: 'payment',
      amount: 950.00,
      description: 'Tuition Payment - January 2025',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-2025-001',
      processedAt: '2025-01-15 14:30:00',
      status: 'completed'
    },
    {
      id: '2',
      accountId: '1',
      studentName: 'Emma Johnson',
      type: 'charge',
      amount: -3800.00,
      description: 'Tuition Charge - Spring Semester 2025',
      paymentMethod: null,
      transactionId: 'CHG-2025-001',
      processedAt: '2025-01-01 08:00:00',
      status: 'completed'
    },
    {
      id: '3',
      accountId: '3',
      studentName: 'Sophia Rodriguez',
      type: 'payment',
      amount: 25.00,
      description: 'Lunch Account Deposit',
      paymentMethod: 'Online Transfer',
      transactionId: 'TXN-2025-002',
      processedAt: '2025-01-20 11:15:00',
      status: 'completed'
    }
  ]

  const financialSummary = {
    totalRevenue: 248750.00,
    outstandingReceivables: 45320.00,
    totalExpenses: 187250.00,
    netIncome: 61500.00,
    averagePaymentTime: 12.5,
    collectionRate: 94.2,
    monthlyTuition: 3800.00,
    enrolledStudents: 1247
  }

  const paymentPlans = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      planType: 'Monthly',
      amount: 950.00,
      frequency: 'Monthly',
      nextDueDate: '2025-02-01',
      remainingPayments: 3,
      autoPayEnabled: false,
      status: 'active'
    },
    {
      id: '2',
      studentName: 'David Chen',
      planType: 'Semester',
      amount: 1900.00,
      frequency: 'Semester',
      nextDueDate: '2025-08-15',
      remainingPayments: 1,
      autoPayEnabled: true,
      status: 'active'
    }
  ]

  const budgetCategories = [
    { category: 'Salaries & Benefits', budgeted: 145000, actual: 142800, variance: 2200, percentage: 58 },
    { category: 'Instructional Materials', budgeted: 25000, actual: 23400, variance: 1600, percentage: 10 },
    { category: 'Technology', budgeted: 18000, actual: 19200, variance: -1200, percentage: 8 },
    { category: 'Facilities & Maintenance', budgeted: 22000, actual: 21100, variance: 900, percentage: 9 },
    { category: 'Special Education Services', budgeted: 35000, actual: 33800, variance: 1200, percentage: 14 },
    { category: 'Administrative', budgeted: 5000, actual: 4950, variance: 50, percentage: 2 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
            <button 
              onClick={() => setShowPaymentForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Process Payment
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${financialSummary.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">${financialSummary.outstandingReceivables.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-gray-900">{financialSummary.collectionRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💸</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-gray-900">${financialSummary.netIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'accounts', name: 'Student Accounts', icon: '👥' },
                { id: 'transactions', name: 'Transactions', icon: '💳' },
                { id: 'budget', name: 'Budget', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Tuition Revenue</span>
                          <span className="text-green-600 font-semibold">$195,400</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">State Funding</span>
                          <span className="text-blue-600 font-semibold">$35,200</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '14%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Grants & Donations</span>
                          <span className="text-purple-600 font-semibold">$12,850</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Other Income</span>
                          <span className="text-yellow-600 font-semibold">$5,300</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '2%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Payment Status Distribution</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-green-800">Current Accounts</div>
                            <div className="text-sm text-green-600">945 students</div>
                          </div>
                          <div className="text-2xl font-bold text-green-600">76%</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-yellow-800">30-Day Overdue</div>
                            <div className="text-sm text-yellow-600">182 students</div>
                          </div>
                          <div className="text-2xl font-bold text-yellow-600">15%</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-red-800">60+ Days Overdue</div>
                            <div className="text-sm text-red-600">95 students</div>
                          </div>
                          <div className="text-2xl font-bold text-red-600">8%</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-blue-800">Payment Plans</div>
                            <div className="text-sm text-blue-600">25 students</div>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">2%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Student Financial Accounts</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>All Accounts</option>
                      <option>Current</option>
                      <option>Past Due</option>
                      <option>Payment Plans</option>
                    </select>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Export Report
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {accounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{account.studentName}</div>
                              <div className="text-sm text-gray-500">{account.studentId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${
                              account.balance < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              ${Math.abs(account.balance).toFixed(2)}
                              {account.balance < 0 && ' (Due)'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              account.status === 'current' ? 'bg-green-100 text-green-800' :
                              account.status === 'past_due' ? 'bg-red-100 text-red-800' :
                              account.status === 'low_balance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {account.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>{account.lastPayment}</div>
                            <div className="text-gray-500">${account.paymentAmount.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">View</button>
                              <button className="text-green-600 hover:text-green-900">Payment</button>
                              <button className="text-blue-600 hover:text-blue-900">Plan</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="2025-01-01"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="2025-01-23"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Filter
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{transaction.studentName}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type === 'payment' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'charge' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type.toUpperCase()}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <div className={`font-medium ${
                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Method:</span>
                              <div className="font-medium">{transaction.paymentMethod || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Transaction ID:</span>
                              <div className="font-medium">{transaction.transactionId}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Processed:</span>
                              <div className="font-medium">{transaction.processedAt}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">View</button>
                          <button className="text-blue-600 hover:text-blue-900">Receipt</button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Budget Analysis</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>FY 2025</option>
                      <option>FY 2024</option>
                      <option>FY 2023</option>
                    </select>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Generate Report
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {budgetCategories.map((category, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">{category.category}</h4>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          category.variance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.variance >= 0 ? '+' : ''}${category.variance.toLocaleString()} variance
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Budgeted</div>
                          <div className="text-lg font-semibold">${category.budgeted.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Actual</div>
                          <div className="text-lg font-semibold">${category.actual.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">% of Budget</div>
                          <div className="text-lg font-semibold">{category.percentage}%</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            category.actual <= category.budgeted ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{width: `${Math.min((category.actual / category.budgeted) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Processing Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Process Payment</h3>
                <button 
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Student...</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.studentName} ({account.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Tuition</option>
                      <option>Lunch</option>
                      <option>Transportation</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Cash</option>
                      <option>Check</option>
                      <option>Credit Card</option>
                      <option>Online Transfer</option>
                      <option>Money Order</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Check Number</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional reference number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional payment notes..."
                  ></textarea>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Send receipt via email
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Apply to oldest charges first
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}