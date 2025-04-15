export const useDeleteWorkout = (
	setAddWorkout: (val: boolean) => void
) => {

	const deleteWorkout = async (id: number) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:8000/delete_workout?id=${id}`,
				{ method: "DELETE" }
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data);
			setAddWorkout(false);
		} catch (error) {
			console.error("Failed to delete workout:", error);
			alert("Something went wrong while deleting the workout.");
		}
	};

	return deleteWorkout;
};
