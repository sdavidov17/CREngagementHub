import { NextRequest, NextResponse } from "next/server";
import featureToggleService from "@/lib/feature-toggle";
import { getServerSession } from "next-auth/next";

// GET /api/feature-toggles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Only allow authenticated users with admin role to access
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    
    await featureToggleService.initialize();
    const features = featureToggleService.getAll();
    return NextResponse.json({ features });
  } catch (error) {
    console.error("Error fetching feature toggles:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature toggles" },
      { status: 500 }
    );
  }
}

// POST /api/feature-toggles
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Only allow authenticated users with admin role to modify
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    
    const { featureName, enabled } = await request.json();
    
    if (typeof featureName !== "string" || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request. Required fields: featureName (string), enabled (boolean)" },
        { status: 400 }
      );
    }
    
    featureToggleService.setFeature(featureName, enabled);
    return NextResponse.json({ 
      success: true, 
      message: `Feature ${featureName} ${enabled ? 'enabled' : 'disabled'} successfully` 
    });
  } catch (error) {
    console.error("Error updating feature toggle:", error);
    return NextResponse.json(
      { error: "Failed to update feature toggle" },
      { status: 500 }
    );
  }
}

// PATCH /api/feature-toggles/reset
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Only allow authenticated users with admin role to reset
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    
    // Reset to default feature flags
    featureToggleService.reset();
    return NextResponse.json({ 
      success: true, 
      message: "Feature flags reset to defaults" 
    });
  } catch (error) {
    console.error("Error resetting feature toggles:", error);
    return NextResponse.json(
      { error: "Failed to reset feature toggles" },
      { status: 500 }
    );
  }
}

// Helper function to check if the user has admin role
function isAdmin(session: any): boolean {
  return session?.user?.role === "ADMIN";
} 