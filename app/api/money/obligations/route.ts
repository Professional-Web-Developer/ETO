import { NextRequest, NextResponse } from 'next/server';
import { ObligationsController } from '../../../../api/money/obligations/obligations.controller';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const data = await ObligationsController.list();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await ObligationsController.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError || err?.issues) {
      return NextResponse.json({ error: 'validation', details: err?.issues || err?.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
