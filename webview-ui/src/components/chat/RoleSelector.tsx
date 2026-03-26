import { memo, useEffect, useCallback, useMemo, useRef } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { updateSetting } from "../settings/utils/settingsHandlers"

const RoleSelector = () => {
	const { customRoles, currentRole } = useExtensionState()

	const allRoles = useMemo(
		() => [{ name: "Senior Software Engineer", description: "Default role" }, ...(customRoles || [])],
		[customRoles]
	)

	const selectedRole = currentRole || "Senior Software Engineer"

	const stateRef = useRef({ allRoles, selectedRole })
	useEffect(() => {
		stateRef.current = { allRoles, selectedRole }
	}, [allRoles, selectedRole])

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
			e.preventDefault()
			const { allRoles, selectedRole } = stateRef.current
			const currentIndex = allRoles.findIndex((role) => role.name === selectedRole)
			if (currentIndex === -1) return

			let nextIndex
			if (e.key === "ArrowUp") {
				// Previous role (wrap around)
				nextIndex = currentIndex > 0 ? currentIndex - 1 : allRoles.length - 1
			} else {
				// Next role (wrap around)
				nextIndex = currentIndex < allRoles.length - 1 ? currentIndex + 1 : 0
			}

			const nextRole = allRoles[nextIndex].name
			// Optimistic update for rapid key presses
			stateRef.current.selectedRole = nextRole
			updateSetting("currentRole", nextRole)
		}
	}, [])

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleKeyDown])

	return (
		<div className="flex items-center relative group cursor-pointer w-auto">
			<select
				className="w-auto h-[24px] bg-transparent border-none appearance-none cursor-pointer text-xs px-0 py-0 focus:outline-none text-left font-medium hover:underline hover:text-[var(--vscode-textLink-activeForeground)] transition-colors"
				onChange={(e) => updateSetting("currentRole", e.target.value)}
				style={{
					color: "var(--vscode-descriptionForeground)",
				}}
				title="Switch Role (Alt+↑/↓)"
				value={selectedRole}>
				{allRoles.map((role) => (
					<option
						key={role.name}
						style={{
							backgroundColor: "var(--vscode-dropdown-background)",
							color: "var(--vscode-dropdown-foreground)",
						}}
						value={role.name}>
						{role.name}
					</option>
				))}
			</select>
		</div>
	)
}

export default memo(RoleSelector)
