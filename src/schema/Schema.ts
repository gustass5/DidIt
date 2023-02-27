import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	image: z.string()
});

export type UserType = z.infer<typeof UserSchema>;

export const ListSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(1),
	author_id: z.string(),
	deleted: z.boolean(),
	participants: z.record(z.string(), UserSchema),
	created_at: z.string(),
	updated_at: z.string()
});

export type ListType = z.infer<typeof ListSchema>;

export const TaskSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(1),
	author_id: z.string(),
	responsible: z.record(z.string(), UserSchema),
	completed: z.record(z.string(), z.boolean()),
	labels: z.string(),
	created_at: z.string(),
	updated_at: z.string()
});

export type TaskType = z.infer<typeof TaskSchema>;

export const InvitationStatusEnum = z.enum([
	'pending',
	'accepted',
	'declined',
	'withdrawn'
]);

export type InvitationStatusType = z.infer<typeof InvitationStatusEnum>;

export const InvitationSchema = z.object({
	id: z.optional(z.string()),
	list: z.object({ id: z.string(), name: z.string() }),
	inviter: UserSchema,
	invited: UserSchema,
	status: InvitationStatusEnum,
	created_at: z.string(),
	updated_at: z.string()
});

export type InvitationType = z.infer<typeof InvitationSchema>;
