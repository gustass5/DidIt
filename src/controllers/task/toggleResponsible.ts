import { TaskSchema, UserType } from '~/schema/Schema';
import { getTask } from './getTask';

export const toggleResponsible = async (formData: FormData, user: UserType) => {
	const { taskData, taskSnapshot } = await getTask(formData, user);

	if (taskData.responsible[user.id] === undefined) {
		const newTaskData = TaskSchema.parse({
			...taskData,
			responsible: {
				...taskData.responsible,
				[user.id]: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image
				}
			}
		});

		await taskSnapshot.ref.set(newTaskData);
	} else {
		const { [user.id]: current, ...rest } = taskData.responsible;
		const { [user.id]: currentCompleted, ...restCompleted } = taskData.completed;

		const newTaskData = TaskSchema.parse({
			...taskData,
			responsible: {
				...rest
			},
			completed: { ...restCompleted }
		});

		await taskSnapshot.ref.set(newTaskData);
	}
};
