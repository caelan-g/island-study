// pages/api/generate-image.ts
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import { Buffer } from "buffer";

const uploadDir = path.resolve(process.cwd(), "public/images");

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
  if (req.method === "POST") {
    const imageBuffer = await fs.readFile(
      path.resolve(process.cwd(), "public", "images", "light_island.png")
    );

    // Convert the buffer to a base64 string
    const base64Image = imageBuffer.toString("base64");

    try {
      //console.log(
      //  "Sending request to RetroDiffusion with prompt:",
      //  req.body.prompt
      //);
      //console.log("Strength:", req.body.strength);
      //console.log("API key loaded:", !!process.env.RETRODIFFUSION_API_KEY);

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
            input_image: base64Image, // Base64 image
            strength: req.body.strength,
            num_images: 1,
            prompt_style: "retro",
          }),
        }
      );

      const data = (await response.json()) as RetroDiffusionResponse;

      // Return the generated image URL
      if (response.ok) {
        // Step 1: Fetch the image data from the image URL provided by RetroDiffusion API
        const base64GeneratedImage = data.base64_images[0];
        const imageBuffer = Buffer.from(base64GeneratedImage, "base64");

        // Step 2: Ensure the upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        const randomInt = Math.floor(Math.random() * 1000000);
        // Step 3: Create a unique filename for the generated image
        //const imagePath = path.join(uploadDir, `${randomInt}.png`);
        const imagePath = path.join(uploadDir, `generated_image.png`);
        // Step 4: Save the image buffer to the file system
        await fs.writeFile(imagePath, imageBuffer);

        // Return the saved image URL
        res.status(200).json({ image: `/images/generated/${randomInt}.png` });
      } else {
        res.status(500).json({ error: "Failed to generate image" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
