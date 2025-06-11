"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";
// Note: Changed to '@supabase/ssr' for robust server-side auth handling in Pages Router
import { createServerSupabaseClient } from "@/lib/supabase/api-server";

interface RetroDiffusionResponse {
  created_at: number;
  credit_cost: number;
  base64_images: string[];
  model: string;
  type: string;
  remaining_credits: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // --- Step 1: Generate Image with RetroDiffusion ---
  let retroDiffusionData: RetroDiffusionResponse;
  try {
    //console.log("Fetching initial image from signed URL...");
    const imageRes = await fetch(req.body.signedUrl);
    if (!imageRes.ok) {
      throw new Error(
        `Failed to fetch image from signed URL: ${imageRes.statusText}`
      );
    }
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    //console.log(
    //  "Sending request to RetroDiffusion with prompt:",
    //  req.body.prompt
    //);
    const response = await fetch(
      "https://api.retrodiffusion.ai/v1/inferences",
      {
        method: "POST",
        headers: {
          "X-RD-Token": process.env.RETRODIFFUSION_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: req.body.prompt,
          model: "RD_FLUX",
          width: 256,
          height: 128,
          input_image: base64Image,
          strength: req.body.strength,
          num_images: 1,
          prompt_style: "retro",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("RetroDiffusion API error:", errorData);
      throw new Error(`Failed to generate image. Status: ${response.status}`);
    }

    retroDiffusionData = (await response.json()) as RetroDiffusionResponse;
    //console.log("Successfully received data from RetroDiffusion.");

    // Defensive check: Ensure we have images to process
    if (
      !retroDiffusionData.base64_images ||
      retroDiffusionData.base64_images.length === 0
    ) {
      console.error("RetroDiffusion response contained no images.");
      throw new Error("Image generation succeeded but returned no images.");
    }
  } catch (error) {
    console.error("Error during image generation step:", error);
    return res.status(500).json({
      error: "Failed to generate image.",
      details: (error as Error).message,
    });
  }

  // --- Step 2: Upload Generated Image to Supabase ---
  try {
    const supabase = createServerSupabaseClient(req, res);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No user session found." });
    }
    //console.log("Authenticated as user:", user.id);

    const base64GeneratedImage = retroDiffusionData.base64_images[0];
    const imageBuffer = Buffer.from(base64GeneratedImage, "base64");
    const filePath = `${user.id}/${Date.now()}.png`; // Use timestamp for uniqueness

    //console.log("Attempting to upload to Supabase storage at path:", filePath);

    const { error: uploadError } = await supabase.storage
      .from("islands")
      .upload(filePath, imageBuffer, {
        contentType: "image/png",
        upsert: true, // Use false if you don't want to overwrite
      });

    if (uploadError) {
      // Log the full error object for better debugging
      console.error("Supabase upload failed:", uploadError);
      // The detailed error from Supabase is often in `error.message`.
      // It might say "new row violates row-level security policy"
      throw new Error(uploadError.message);
    }

    //console.log("Successfully uploaded to storage:", uploadData);

    const { data: publicUrlData } = supabase.storage
      .from("islands")
      .getPublicUrl(filePath);

    return res.status(200).json({
      message: "Image generated and uploaded successfully",
      publicUrl: publicUrlData.publicUrl,
      filePath: filePath,
    });
  } catch (error) {
    console.error("Error during Supabase upload step:", error);
    return res.status(500).json({
      error: "Failed to upload image to storage.",
      details: (error as Error).message,
    });
  }
}
