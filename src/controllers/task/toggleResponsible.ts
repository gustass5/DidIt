import { TaskSchema, UserType } from '~/schema/Schema';
import { getTask } from './getTask';
import { json } from '@remix-run/node';

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

		return json({
			notification: {
				type: 'success',
				title: 'Success',
				text: 'You are now responsible for this task completion'
			}
		});
	}

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

	return json({
		notification: {
			type: 'success',
			title: 'Success',
			text: 'You are no longer responsible for this task completion'
		}
	});
};
