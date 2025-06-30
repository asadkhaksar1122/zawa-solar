import { SolarSolution } from "@/lib/models/solution";
import UserModel from "@/lib/models/user";
import { dbConnect } from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();

        // Get the count of documents in the User collection
        const userCount = await UserModel.countDocuments();

        // Get the count of documents in the Solution collection
        const solutionCount = await SolarSolution.countDocuments();

        // Return the counts in the response
        return NextResponse.json({
            userCount,
            solutionCount,

        });
    } catch (error) {
        // Handle any errors
        console.error("Error fetching document counts:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}