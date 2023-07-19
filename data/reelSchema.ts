import { object, string, number, array } from 'yup';

let reelSchema = object({
  items: array().of(string().required()),
  odds: array().of(number().required().positive().integer()),
  reelIndex: number().required().integer().moreThan(-1),
}).required();

let reelsSchema = object({
  reels: array().of(reelSchema),
  reelsAmount: number()
    .required()
    .positive()
    .integer()
    .min(3, 'At least 3 reels'),
  reelsDisplayHeight: number()
    .required('Height is required')
    .positive('Has to be positive')
    .integer('Has to be an integer')
    .min(3, 'At least 3 items high'),
  reelsLength: number()
    .required('Length is required')
    .positive('Has to be positive')
    .integer('Has to be an integer')
    .min(4, 'At least 4 items long'),
}).required();

export default reelsSchema;
