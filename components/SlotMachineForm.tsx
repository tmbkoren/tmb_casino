import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, set } from 'react-hook-form';
import { tarkovPreset, dotaPreset } from '@/data/presets';
import reelsSchema from '@/data/reelSchema';
import { yupResolver } from '@hookform/resolvers/yup';

interface SlotMachineFormProps {
  currentReels: {
    reelIndex: number;
    items: string[];
    odds: number[];
  }[];
  setReels: (
    reels: {
      reelIndex: number;
      items: string[];
      odds: number[];
    }[]
  ) => void;
  setReelHeight: (reelHeight: number) => void;
}

type FormValues = {
  reelsAmount: number;
  reelsLength: number;
  reelsDisplayHeight: number;
  reels:
    | {
        items?: string[];
        odds?: number[];
        reelIndex: number;
      }[]
    | undefined;
};

const SlotMachineForm: React.FC<SlotMachineFormProps> = ({
  currentReels,
  setReels,
  setReelHeight,
}) => {
  const [amountOfReels, setAmountOfReels] = useState<number>(
    currentReels.length
  );
  const [reelsLength, setReelsLength] = useState<number>(
    currentReels[0].items.length
  );
  const [formReels, setFormReels] = useState(currentReels);
  const [validationErrors, setValidatonErrors] = useState<string[]>([]);

  const appendValidationError = (error: string) => {
    setValidatonErrors((prev) => {
      const newErrors = [...prev];
      newErrors.push(error);
      return newErrors;
    });
  };

  const resetValidationErrors = () => {
    setValidatonErrors([]);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(reelsSchema),
    defaultValues: {
      reelsAmount: amountOfReels,
      reelsDisplayHeight: 5,
      reelsLength: reelsLength,
      reels: formReels,
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    name: 'reels',
    control,
  });

  const formReelsAmount = watch('reelsAmount');
  const formReelsLength = watch('reelsLength');

  // reelsAmount change

  useEffect(() => {
    //@ts-ignore getValues().reels is not undefined
    const tempReels = [...getValues().reels];
    const newVal = formReelsAmount;
    const oldVal = amountOfReels;
    if (newVal > oldVal) {
      for (let i: number = oldVal; i < newVal; ++i) {
        if (typeof reelsLength !== 'number') {
          setReelsLength(parseInt(reelsLength));
        }
        append({
          reelIndex: typeof i === 'number' ? i : parseInt(i),
          items: [...Array(reelsLength).fill('')],
          odds: [...Array(reelsLength).fill(0)],
        });
        setFormReels(() => {
          const newReels = [...tempReels];
          newReels.push({
            reelIndex: typeof i === 'number' ? i : parseInt(i),
            items: [...Array(reelsLength).fill('')],
            odds: [...Array(reelsLength).fill(0)],
          });
          return newReels;
        });
      }
    } else if (newVal < oldVal) {
      for (let i = oldVal; i > newVal; --i) {
        remove(i - 1);
        setFormReels(() => {
          const newReels = [...tempReels];
          newReels.pop();
          return newReels;
        });
      }
    }
    setAmountOfReels(newVal);
  }, [formReelsAmount]);

  // reelsLength change
  useEffect(() => {
    const newVal =
      typeof formReelsLength === 'number'
        ? formReelsLength
        : parseInt(formReelsLength);
    const oldVal = formReels[0].items.length;
    if (newVal > oldVal) {
      for (let i = 0; i < amountOfReels; ++i) {
        setFormReels((prev) => {
          const newReels = [...prev];
          newReels[i]?.items.push('');
          newReels[i]?.odds.push(0);
          return newReels;
        });
      }
    } else if (newVal < oldVal) {
      for (let i = 0; i < amountOfReels; ++i) {
        setFormReels((prev) => {
          const newReels = [...prev];
          newReels[i]?.items.pop();
          newReels[i]?.odds.pop();
          return newReels;
        });
      }
    }

    setReelsLength(typeof newVal === 'number' ? newVal : parseInt(newVal));
  }, [formReelsLength]);

  // trigger the re-render after reelLength change
  useEffect(() => {
    replace(formReels);
    setValue('reels', formReels);
  }, [formReels]);

  const validateReels = (
    reels: {
      reelIndex: number;
      items: string[];
      odds: number[];
    }[],
    reelsDisplayHeight: number
  ) => {
    resetValidationErrors();
    let isValid = true;

    if (reels.length < 3) {
      isValid = false;
      appendValidationError('Reels amount must be greater than 3');
      return isValid;
    }

    reels.forEach((reel, index) => {
      // validate odds
      let sumOfOdds = 0;
      reel.odds.forEach((odd) => {
        sumOfOdds += odd;
      });
      if (sumOfOdds !== 100) {
        isValid = false;
        appendValidationError(
          `Sum of odds in reel ${index + 1} is ${sumOfOdds}, it must be 100`
        );
      }
    });
    if (reelsDisplayHeight % 2 === 0 || reelsDisplayHeight >= reelsLength) {
      // validate display height
      isValid = false;
      appendValidationError(
        `Reels display height must be odd and less than reels length`
      );
    }
    return isValid;
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const submitReels = data.reels ? data.reels : [];
    const displayHeight = data.reelsDisplayHeight;
    if (submitReels) {
      //@ts-ignore submitReels is not undefined
      if (validateReels(submitReels, displayHeight)) {
        //@ts-ignore submitReels is not undefined
        setReels(submitReels);
        setReelHeight(displayHeight);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
      className='flex flex-col gap-3 p-5'
    >
      {validationErrors.map((error, index) => {
        return (
          <div
            key={`validationError${index}`}
            className=''
          >
            <span className='text-red-500'>{error}</span>
          </div>
        );
      })}
      <label>
        <span className='mr-3'>Amount of reels: </span>
        <input
          className='border w-10 text-center'
          type='number'
          {...register('reelsAmount', { valueAsNumber: true })}
        />
      </label>
      <label>
        <span className='mr-3'>Reel length</span>
        <input
          className='border w-10 text-center'
          type='number'
          {...register('reelsLength', { valueAsNumber: true })}
        />
      </label>
      <label>
        <span className='mr-3'>Reel display height:</span>
        <input
          className='border w-10 text-center'
          type='number'
          {...register('reelsDisplayHeight')}
        />
      </label>
      <div className='p-5 flex flex-row flex-wrap gap-3 border'>
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className='p-3 flex flex-row gap-3 border'
            >
              <div className='flex flex-col gap-3'>
                {field.items?.map((item, itemIndex) => {
                  return (
                    <label key={itemIndex}>
                      <span className='mr-3'>Item {itemIndex + 1}:</span>
                      <input
                        className='border w-12 text-center'
                        type='text'
                        {...register(`reels.${index}.items.${itemIndex}`)}
                      />
                    </label>
                  );
                })}
              </div>
              <div className='flex flex-col gap-3'>
                {field.odds?.map((odd, oddIndex) => {
                  return (
                    <label key={oddIndex}>
                      <span className='mr-3'>Odds {oddIndex + 1}:</span>
                      <input
                        className='border w-12 text-center'
                        type='number'
                        {...register(`reels.${index}.odds.${oddIndex}`, {
                          valueAsNumber: true,
                        })}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <input type='submit' />
    </form>
  );
};

export default SlotMachineForm;
