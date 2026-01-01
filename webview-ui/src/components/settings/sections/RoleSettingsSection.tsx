import { CustomRole } from "@shared/storage/types"
import { VSCodeButton, VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { memo, useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"
import { updateSetting } from "../utils/settingsHandlers"

interface RoleSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const RoleSettingsSection = ({ renderSectionHeader }: RoleSettingsSectionProps) => {
	const { customRoles } = useExtensionState()
	const [newRoleName, setNewRoleName] = useState("")
	const [newRoleDescription, setNewRoleDescription] = useState("")

	const handleAddRole = () => {
		if (newRoleName && newRoleDescription) {
			const newRoles = [...(customRoles || []), { name: newRoleName, description: newRoleDescription }]
			updateSetting("customRoles", { roles: newRoles })
			setNewRoleName("")
			setNewRoleDescription("")
		}
	}

	const handleDeleteRole = (index: number) => {
		const newRoles = [...(customRoles || [])]
		newRoles.splice(index, 1)
		updateSetting("customRoles", { roles: newRoles })
	}

	const handleUpdateRole = (index: number, updatedRole: CustomRole) => {
		const newRoles = [...(customRoles || [])]
		newRoles[index] = updatedRole
		updateSetting("customRoles", { roles: newRoles })
	}

	return (
		<div>
			{renderSectionHeader("roles")}
			<Section>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<h3 className="text-vscode-foreground font-medium">Add New Role</h3>
						<div className="flex flex-col gap-2 p-3 border border-vscode-widget-border rounded-md bg-vscode-list-hoverBackground">
							<VSCodeTextField
								className="w-full"
								onInput={(e: any) => setNewRoleName(e.target.value)}
								placeholder="Role Name"
								value={newRoleName}
							/>
							<VSCodeTextArea
								className="w-full resize-y"
								onInput={(e: any) => setNewRoleDescription(e.target.value)}
								placeholder="Role Description (System Prompt)"
								rows={5}
								value={newRoleDescription}
							/>
							<div className="flex justify-end">
								<VSCodeButton
									appearance="primary"
									disabled={!newRoleName || !newRoleDescription}
									onClick={handleAddRole}>
									<span className="codicon codicon-add" slot="start"></span>
									Add Role
								</VSCodeButton>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="text-vscode-foreground font-medium">Custom Roles</h3>
						{!customRoles || customRoles.length === 0 ? (
							<p className="text-xs text-vscode-descriptionForeground">No custom roles defined.</p>
						) : (
							<div className="flex flex-col gap-3">
								{customRoles.map((role, index) => (
									<div
										className="flex flex-col gap-2 p-3 border border-vscode-widget-border rounded-md bg-vscode-editor-background"
										key={index}>
										<div className="flex justify-between items-center">
											<span className="font-bold">{role.name}</span>
											<VSCodeButton
												appearance="icon"
												aria-label="Delete Role"
												onClick={() => handleDeleteRole(index)}>
												<span className="codicon codicon-trash"></span>
											</VSCodeButton>
										</div>
										<VSCodeTextArea
											className="w-full resize-y"
											onInput={(e: any) =>
												handleUpdateRole(index, { ...role, description: e.target.value })
											}
											rows={3}
											value={role.description}
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="flex flex-col gap-2 mt-4">
						<h3 className="text-vscode-foreground font-medium">Default Role (Read Only)</h3>
						<div className="p-3 border border-vscode-widget-border rounded-md bg-vscode-editor-background opacity-70">
							<span className="font-bold block mb-2">Senior Software Engineer</span>
							<p className="text-sm text-vscode-descriptionForeground">
								You are Cline, a highly skilled software engineer with extensive knowledge in many programming
								languages, frameworks, design patterns, and best practices.
							</p>
						</div>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default memo(RoleSettingsSection)
