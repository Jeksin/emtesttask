export type AppealStatus = 'Новое' | 'В работе' | 'Завершено' | 'Отменено';

export interface Appeal {
    id: number;
    topic: string;
    text: string;
    solution?: string | null;
    cancelReason?: string | null;
    status: AppealStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAppealData {
    topic: string;
    text: string;
}

export interface CompleteAppealData {
    solution: string;
}

export interface CancelAppealData {
    cancelReason: string;
}