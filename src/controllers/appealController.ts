import { Request, Response } from 'express';
import * as appealService from '../services/appealServices';
import { Appeal, CreateAppealData, CompleteAppealData, CancelAppealData } from '../models/appeal';

export const createAppeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { topic, text } = req.body as CreateAppealData;
        const appeal = await appealService.createAppeal({ topic, text });
        res.status(201).json(appeal);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось создать обращение' });
    }
};

export const takeAppealToWork = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const appeal = await appealService.takeAppealToWork(id);
        res.json(appeal);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось принять обращение в работу' });
    }
};

export const completeAppeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { solution } = req.body as CompleteAppealData;
        const appeal = await appealService.completeAppeal(id, { solution });
        res.json(appeal);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось завершить обращение' });
    }
};

export const cancelAppeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { cancelReason } = req.body as CancelAppealData;
        const appeal = await appealService.cancelAppeal(id, { cancelReason });
        res.json(appeal);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось отменить обращение' });
    }
};

export const getAppeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, startDate, endDate } = req.query;
    
    // Валидация дат
    if (date && (startDate || endDate)) {
      res.status(400).json({ error: 'Используйте либо date, либо startDate/endDate' });
      return;
    }

    const appeals = await appealService.getAppeals(
      date as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined
    );
    
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить обращения' });
  }
};

export const cancelAllInProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await appealService.cancelAllInProgress();
        res.json({ message: `Отменено ${result.count} обращений` });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось отменить обращения' });
    }
};

export const getAppealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const appeal = await appealService.getAppealById(id);
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить обращение' });
  }
};