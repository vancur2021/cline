export type OpenaiReasoningEffort = "minimal" | "low" | "medium" | "high"

export type Mode = "plan" | "act"

export interface CustomRole {
	name: string
	description: string
}
