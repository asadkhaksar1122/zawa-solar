import UserModel from "@/lib/models/user";
import { dbConnect } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        let alladmin = await UserModel.find({ role: "admin" })
        return NextResponse.json(alladmin)
    } catch (err) {
        return NextResponse.json({ error: "some thing went wrong" }, { status: 500 })
    }
}