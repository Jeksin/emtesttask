import { Prisma } from '@prisma/client';
import prisma from '../utils/database';
import { Appeal, AppealStatus } from '../models/appeal';
import { toMoscowTime, fromMoscowTime } from '../utils/dateUtils';

const getCurrentMskTime = () => fromMoscowTime(new Date());

export const createAppeal = async (data: { topic: string; text: string }): Promise<Appeal> => {
  const result = await prisma.appeal.create({
    data: {
      topic: data.topic,
      text: data.text,
      status: 'Новое',
      createdAt: getCurrentMskTime(),
      updatedAt: getCurrentMskTime()
    }
  });

  return {
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  };
};

export const takeAppealToWork = async (id: number): Promise<Appeal> => {
  const result = await prisma.appeal.update({
    where: { id },
    data: {
      status: 'В работе',
      updatedAt: getCurrentMskTime()
    }
  });

  return {
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  };
};

export const completeAppeal = async (id: number, data: { solution: string }): Promise<Appeal> => {
  const result = await prisma.appeal.update({
    where: { id },
    data: {
      status: 'Завершено',
      solution: data.solution,
      updatedAt: getCurrentMskTime()
    }
  });

  return {
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  };
};

export const cancelAppeal = async (id: number, data: { cancelReason: string }): Promise<Appeal> => {
  const result = await prisma.appeal.update({
    where: { id },
    data: {
      status: 'Отменено',
      cancelReason: data.cancelReason,
      updatedAt: getCurrentMskTime()
    }
  });

  return {
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  };
};

export const getAppeals = async (
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<Appeal[]> => {
  let where: Prisma.AppealWhereInput = {};
  const parseMskToUTC = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : fromMoscowTime(date);
  };
  if (date) {
    const mskDate = new Date(date);
    if (isNaN(mskDate.getTime())) {
      throw new Error('Неверный формат даты. Используйте YYYY-MM-DD');
    }

    const startOfDay = new Date(mskDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(mskDate);
    endOfDay.setHours(23, 59, 59, 999);

    where.createdAt = {
      gte: fromMoscowTime(startOfDay),
      lte: fromMoscowTime(endOfDay)
    };
  } 
  else {
    const start = parseMskToUTC(startDate);
    const end = parseMskToUTC(endDate);

    if (start || end) {
      where.createdAt = {};
      if (start) where.createdAt.gte = start;
      if (end) where.createdAt.lte = end;
    }
  }

  const results = await prisma.appeal.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return results.map(result => ({
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  }));
};

export const cancelAllInProgress = async (): Promise<{ count: number }> => {
  const result = await prisma.appeal.updateMany({
    where: { status: 'В работе' },
    data: {
      status: 'Отменено',
      updatedAt: getCurrentMskTime()
    }
  });
  return { count: result.count };
};

export const getAppealById = async (id: number): Promise<Appeal | null> => {
  const result = await prisma.appeal.findUnique({
    where: { id }
  });

  if (!result) return null;
  return {
    ...result,
    createdAt: toMoscowTime(result.createdAt),
    updatedAt: toMoscowTime(result.updatedAt),
    status: result.status as AppealStatus
  };
};