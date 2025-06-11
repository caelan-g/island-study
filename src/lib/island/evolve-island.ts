export async function evolveIsland(data: FormData) {
  try {
    const imageName = "light_island.png"; // Just the image name (without "/images/")

    const response = await fetch("/api/retro-diffusion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.prompt,
        strength: data.strength,
        imagePath: imageName, // Extract the base64 string without the data URL part
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error("Failed to generate image");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
