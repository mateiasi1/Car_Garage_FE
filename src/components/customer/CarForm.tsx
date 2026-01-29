import { FC, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, CheckCircle, Loader2 } from 'lucide-react';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { ComboboxInput } from '../shared/ComboboxInput';
import { Button } from '../shared/Button';
import { CarCategories } from '../../utils/enums/CarCategories';
import { useFetchMakesQuery, useFetchModelsForMakeQuery } from '../../rtk/services/car-makes-models-service';
import { useGetCountiesQuery } from '../../rtk/services/location-service';
import { useLazyLookupCarByPlateQuery } from '../../rtk/services/customer-profile-service';
import { CustomerCar } from '../../models/CustomerCar';
import { AddCustomerCarDTO, UpdateCustomerCarDTO } from '../../interfaces/customer-portal.payload';

interface LookupResult {
  car: { licensePlate: string; category: string; make?: string; model?: string; countyId?: string };
  customer: { firstName: string; lastName: string; phoneNumber: string };
}

interface CarFormProps {
  car?: CustomerCar;
  onSubmit: (data: AddCustomerCarDTO | UpdateCustomerCarDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CarForm: FC<CarFormProps> = ({ car, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();

  const [licensePlate, setLicensePlate] = useState(car?.licensePlate || '');
  const [category, setCategory] = useState(car?.category || CarCategories.B);
  const [countyId, setCountyId] = useState(car?.countyId || '');
  const [make, setMake] = useState(car?.make || '');
  const [model, setModel] = useState(car?.model || '');
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupSuggestion, setLookupSuggestion] = useState<LookupResult | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: makes = [], isLoading: makesLoading } = useFetchMakesQuery();
  const { data: models = [], isLoading: modelsLoading } = useFetchModelsForMakeQuery(make, { skip: !make });
  const { data: counties = [], isLoading: countiesLoading } = useGetCountiesQuery();
  const [lookupCar, { isFetching: isLookingUp }] = useLazyLookupCarByPlateQuery();

  const lookupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLicensePlateLookup = useCallback((plate: string) => {
    if (lookupTimeoutRef.current) {
      clearTimeout(lookupTimeoutRef.current);
    }

    const normalized = plate.toUpperCase().replace(/\s/g, '');
    if (normalized.length < 5) {
      setLookupSuggestion(null);
      setAutoFilled(false);
      return;
    }

    lookupTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await lookupCar(normalized).unwrap();
        if (result.found && result.car && result.customer) {
          setLookupSuggestion({ car: result.car, customer: result.customer });
        } else {
          setLookupSuggestion(null);
        }
      } catch {
        setLookupSuggestion(null);
      }
    }, 500);
  }, [lookupCar]);

  const handleSelectSuggestion = () => {
    if (!lookupSuggestion) return;
    const { car: carData } = lookupSuggestion;
    if (carData.make) setMake(carData.make);
    if (carData.model) setModel(carData.model);
    if (carData.countyId) setCountyId(carData.countyId);
    if (carData.category) setCategory(carData.category as CarCategories);
    setAutoFilled(true);
    setLookupSuggestion(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!licensePlate.trim()) {
      newErrors.licensePlate = t('validation.required');
    } else if (licensePlate.length < 5) {
      newErrors.licensePlate = t('customer.cars.invalidPlate');
    }

    if (!category) {
      newErrors.category = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: AddCustomerCarDTO | UpdateCustomerCarDTO = {
      licensePlate: licensePlate.toUpperCase().trim(),
      category,
      countyId: countyId || undefined,
      make: make.trim(),
      model: model.trim(),
    };

    onSubmit(data);
  };

  const categoryOptions = Object.values(CarCategories).map((cat) => ({
    value: cat,
    label: cat,
  }));

  const countyOptions = counties.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <CustomInput
          label={t('customer.cars.licensePlate')}
          value={licensePlate}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setLicensePlate(val);
            setErrors((prev) => ({ ...prev, licensePlate: '' }));
            setAutoFilled(false);
            setLookupSuggestion(null);
            if (!car) handleLicensePlateLookup(val);
          }}
          error={errors.licensePlate}
          placeholder="B 123 ABC"
          isRequired
        />
        {isLookingUp && (
          <div className="absolute right-3 top-8">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}

        {/* Clickable suggestion */}
        {lookupSuggestion && !autoFilled && (
          <button
            type="button"
            onClick={handleSelectSuggestion}
            className="w-full mt-1 p-3 bg-primary/5 border border-primary/20 rounded-lg text-left hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-text">
                  {lookupSuggestion.car.make} {lookupSuggestion.car.model}
                </span>
                <span className="text-muted ml-2">
                  ({lookupSuggestion.customer.firstName} {lookupSuggestion.customer.lastName})
                </span>
              </div>
            </div>
            <p className="text-xs text-primary mt-1">{t('customer.cars.clickToFill')}</p>
          </button>
        )}

        {autoFilled && !isLookingUp && (
          <div className="flex items-center gap-1 mt-1 text-xs text-success">
            <CheckCircle className="w-3 h-3" />
            <span>{t('customer.cars.dataAutoFilled')}</span>
          </div>
        )}
      </div>

      <CustomSelect
        label={t('customer.cars.category')}
        value={category}
        onChange={(val) => setCategory(val as CarCategories)}
        options={categoryOptions}
        error={errors.category}
      />

      <CustomSelect
        label={t('county')}
        value={countyId}
        onChange={(val) => setCountyId(val)}
        options={countyOptions}
        searchable
        placeholder={countiesLoading ? t('loading') : t('selectCounty')}
        disabled={countiesLoading}
      />

      <ComboboxInput
        label={t('customer.cars.make')}
        value={make}
        onChange={(val) => {
          setMake(val);
          setModel(''); // Reset model when make changes
          setAutoFilled(false);
        }}
        options={[...makes].sort()}
        allowCustom={true}
        loading={makesLoading}
        placeholder={t('customer.cars.selectMake')}
      />

      {make && (
        <ComboboxInput
          label={t('customer.cars.model')}
          value={model}
          onChange={(val) => {
            setModel(val);
            setAutoFilled(false);
          }}
          options={models}
          allowCustom={true}
          loading={modelsLoading}
          placeholder={t('customer.cars.selectModel')}
        />
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {car ? t('common.save') : t('customer.cars.addCar')}
        </Button>
      </div>
    </form>
  );
};

export default CarForm;
