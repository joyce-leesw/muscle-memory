import { useState } from "react";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useUpdateWorkout } from "@/hooks/useUpdateWorkout";
import { useDeleteWorkout } from "@/hooks/useDeleteWorkout";
import { useCreateWorkoutSession } from "@/hooks/useCreateWorkoutSession";
import { WorkoutSessionMap, Workout } from "@/types/workout";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
	date: string;
	allWorkouts: WorkoutSessionMap;
	workoutTypes: { id: number; name: string; color: string }[]
};

const Logs: React.FC<Props> = ({ date, allWorkouts, workoutTypes }) => {
	const workoutsToday = allWorkouts[date]?.workouts || [];
	const [editWorkoutId, setEditWorkoutId] = useState<number | null>(null);
	const [addWorkout, setAddWorkout] = useState(false);
	const [newWorkout, setNewWorkout] = useState({
		name: "",
		reps: 0,
		weight: 0,
		sets: 0,
	});
	const [showSessionModal, setShowSessionModal] = useState(false);
	const queryClient = useQueryClient();

	const createWorkoutMutation = useCreateWorkout(allWorkouts, date, setAddWorkout);
	const updateWorkoutMutation = useUpdateWorkout(setAddWorkout);
	const deleteWorkoutMutation = useDeleteWorkout(setAddWorkout);
	const createWorkoutSessionMutation = useCreateWorkoutSession(date, setShowSessionModal);

	const handleNumberInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		key: keyof typeof newWorkout,
	) => {
		const val = e.target.value;

		if (/^\d+(\.\d+)?$/.test(val)) {
			const num = Number(val);
			if (num >= 0) {
				setNewWorkout((prev) => ({ ...prev, [key]: num }));
			}
		}
	};

	const handleSaveWorkout = () => {
		const isEdit = !!editWorkoutId;
		try {
			if (isEdit) {
				updateWorkoutMutation.mutate({ id: editWorkoutId, updatedWorkout: newWorkout });
			} else {
				createWorkoutMutation.mutate(newWorkout);
			}
			queryClient.invalidateQueries({ queryKey: ["workoutTypes"] });
		} catch (error) {
			console.error("Error deleting workout", error);
		}
	};

	const handleDeleteWorkout = (id: number) => {
		deleteWorkoutMutation.mutate(id);
	}

	const handleEditWorkout = (log: Workout) => {
		setAddWorkout(true);
		setEditWorkoutId(log.id);
		setNewWorkout({
			name: log.name,
			reps: log.reps,
			weight: log.weight,
			sets: log.sets,
		});
	}

	const handleAddWorkout = () => {
		if (!allWorkouts[date]) {
			setShowSessionModal(true);
		} else {
			setAddWorkout(true);
			setEditWorkoutId(null);
			setNewWorkout({ name: "", reps: 0, weight: 0, sets: 0 });
		}
	}

	const handleLabel = (type_id: number) => {
		createWorkoutSessionMutation.mutate(type_id)
	}

  return (
		<div className="bg-white p-4 rounded-xl shadow-lg relative my-3 w-full">
			{showSessionModal && (
				<div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
					<div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4">
						<h2 className="text-lg font-semibold">Label this day</h2>
						<div className="space-y-2">
							{workoutTypes.map((type, index) => (
								<button key={index} className="flex items-center gap-2 my-2 px-3 py-1 rounded hover:bg-gray-100 w-60" onClick={() => handleLabel(type.id)}>
									<span
										className={`w-3 h-3 rounded-full inline-block ${`bg-${type.color}-500`}`}
									/>
									<span className="text-sm text-gray-700">{type.name}</span>
								</button>
							))}
						</div>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowSessionModal(false)}
								className="px-4 py-2 text-sm bg-gray-200 rounded-md"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
			<button
				onClick={handleAddWorkout}
				className="absolute top-4 right-4 text-white bg-sky-600 hover:bg-sky-700 w-8 h-8 flex items-center justify-center rounded-full shadow"
			>
				+
			</button>

			{addWorkout ? (
				<div className="mt-10 space-y-4">
					<label className="block mb-1 text-sm font-medium text-gray-700">
						Workout name
					</label>
					<input
						type="text"
						value={newWorkout.name}
						onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<label className="block mb-1 text-sm font-medium text-gray-700">
						Reps
					</label>
					<input
						type="number"
						value={newWorkout.reps}
						onChange={(e) => handleNumberInput(e, 'reps')}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<label className="block mb-1 text-sm font-medium text-gray-700">
						Weight(kg)
					</label>
					<input
						type="number"
						value={newWorkout.weight}
						onChange={(e) => handleNumberInput(e, 'weight')}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<label className="block mb-1 text-sm font-medium text-gray-700">
						Sets
					</label>
					<input
						type="number"
						value={newWorkout.sets}
						onChange={(e) => handleNumberInput(e, 'sets')}
						className="w-full px-4 py-2 bg-slate-100 rounded"
					/>
					<div className="flex justify-end space-x-2">
						{editWorkoutId && (
							<button
								onClick={() => handleDeleteWorkout(editWorkoutId)}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
							>
								Delete
							</button>
						)}
						<button
							onClick={handleSaveWorkout}
							className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
						>
							Save
						</button>
						<button
							onClick={() => setAddWorkout(false)}
							className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="mt-10 space-y-2">
					{workoutsToday.length > 0 ? (
						workoutsToday.map((log, index) => (
							<div key={index} className="px-2 text-left">
								<div className="flex justify-between items-center">
									<div>
										<div className="text-md text-gray-500">
											{log.name}
										</div>
										<div className="flex space-x-4">
										<span className="w-15 justify-between">
											<span className="text-lg font-bold text-sky-600">{log.weight}</span>
											<span className="text-sm text-gray-600"> kg</span>
										</span>
										<span className="w-15 justify-between">
											<span className="text-lg font-bold text-sky-600">{log.reps}</span>
											<span className="text-sm text-gray-600"> reps</span>
										</span>
										<span className="w-15 justify-between">
											<span className="text-lg font-bold text-sky-600 w-4">{log.sets}</span>
											<span className="text-sm text-gray-600"> sets</span>
										</span>
										</div>
									</div>
									<button
										onClick={() => handleEditWorkout(log)}
										className="text-blue-500 hover:text-blue-700"
									>
										edit &gt;
									</button>
								</div>
								<div className="border-b border-gray-300 my-3"></div>
							</div>
						))
					) : (
						<p className="text-gray-500">No logs for this day.</p>
					)}
				</div>
			)}
		</div>
  );
};

export default Logs;