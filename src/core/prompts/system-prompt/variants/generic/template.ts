import { SystemPromptSection } from "../../templates/placeholders"

export const baseTemplate = `<identity>
{{${SystemPromptSection.AGENT_ROLE}}}
</identity>

<objective>
{{${SystemPromptSection.OBJECTIVE}}}
</objective>

<capabilities>
{{${SystemPromptSection.CAPABILITIES}}}

{{${SystemPromptSection.CLI_SUBAGENTS}}}

{{${SystemPromptSection.TOOL_USE}}}

{{${SystemPromptSection.EDITING_FILES}}}

{{${SystemPromptSection.ACT_VS_PLAN}}}
</capabilities>

<communication_style>
{{${SystemPromptSection.FEEDBACK}}}
</communication_style>

<user_information>
{{${SystemPromptSection.SYSTEM_INFO}}}
</user_information>

<mcp_servers>
{{${SystemPromptSection.MCP}}}
</mcp_servers>

<user_rules>
{{${SystemPromptSection.RULES}}}

{{${SystemPromptSection.USER_INSTRUCTIONS}}}
</user_rules>


<task_tracking>
{{${SystemPromptSection.TASK_PROGRESS}}}
</task_tracking>`
