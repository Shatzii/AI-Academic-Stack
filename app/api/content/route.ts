import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertContentLibrarySchema } from '../../../shared/schema'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const subject = searchParams.get('subject')
    const gradeLevel = searchParams.get('gradeLevel')

    const content = await storage.getContentLibrary({
      type: type || undefined,
      subject: subject || undefined,
      gradeLevel: gradeLevel || undefined
    })

    return NextResponse.json({
      success: true,
      content,
      total: content.length
    })

  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertContentLibrarySchema.parse(body)

    const content = await storage.createContent(validatedData)

    return NextResponse.json({
      success: true,
      content,
      message: 'Content created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Content creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}