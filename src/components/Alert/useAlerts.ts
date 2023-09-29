import { useActionData } from '@remix-run/react';

import { useEffect } from 'react';
import { Alert } from './Alert';
import { z } from 'zod';

const AlertSchema = z.object({
	type: z.union([
		z.literal('success'),
		z.literal('error'),
		z.literal('warning'),
		z.literal('info'),
		z.literal('question')
	]),
	title: z.string(),
	text: z.string()
});

export type AlertType = z.infer<typeof AlertSchema>;

export const useAlerts = () => {
	const actionData = useActionData();
	useEffect(() => {
		if (!actionData) {
			return;
		}

		if (!('notification' in actionData)) {
			return;
		}

		const notification = AlertSchema.safeParse(actionData.notification);

		if (notification.success) {
			const { data } = notification;

			Alert.fire({
				icon: data.type,
				title: data.title,
				text: data.text,
				iconColor: getIconColor(data.type)
			});
			return;
		}

		Alert.fire({
			icon: 'warning',
			title: 'Notification error',
			text: 'Unable to display alert message'
		});
	}, [actionData]);
};

const getIconColor = (type: string) => {
	if (type === 'success') {
		return '#4ade80';
	}

	if (type === 'error') {
		return '#f64668';
	}

	if (type === 'warning') {
		return '#2dd4bf';
	}

	if (type === 'info') {
		return '#60a5fa';
	}

	return 'white';
};
