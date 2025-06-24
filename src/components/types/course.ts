import { z } from "zod";

export const colours = [
  { name: "Blue", colour: "#AEC6CF" },
  { name: "Green", colour: "#B2F2BB" },
  { name: "Yellow", colour: "#FFFACD" },
  { name: "Pink", colour: "#FFB6C1" },
  { name: "Purple", colour: "#D7BDE2" },
  { name: "Orange", colour: "#FFDAB9" },
  { name: "Mint", colour: "#AAF0D1" },
  { name: "Lavender", colour: "#E6E6FA" },
  { name: "Coral", colour: "#F7CAC9" },
  { name: "Teal", colour: "#B2DFDB" },
];

const colourHexValues = colours.map((c) => c.colour);

export type courseProps = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  total: string;
  colour: string;
};

export const courseSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Course name must be at least 3 characters.",
    })
    .max(20, {
      message: "Course name must be at most 20 characters.",
    }),
  colour: z.string().refine((val) => colourHexValues.includes(val), {
    message: "Please select a valid colour",
  }),
});
