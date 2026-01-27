import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { ComboboxInput } from '../shared/ComboboxInput';
import { Button } from '../shared/Button';
import { CarCategories } from '../../utils/enums/CarCategories';
import { useFetchMakesQuery, useFetchModelsForMakeQuery } from '../../rtk/services/car-makes-models-service';
import { useGetCountiesQuery } from '../../rtk/services/location-service';
import { CustomerCar } from '../../models/CustomerCar';
import { AddCustomerCarDTO, UpdateCustomerCarDTO } from '../../interfaces/customer-portal.payload';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: makes = [], isLoading: makesLoading } = useFetchMakesQuery();
  const { data: models = [], isLoading: modelsLoading } = useFetchModelsForMakeQuery(make, { skip: !make });
  const { data: counties = [], isLoading: countiesLoading } = useGetCountiesQuery();

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
      <CustomInput
        label={t('customer.cars.licensePlate')}
        value={licensePlate}
        onChange={(e) => {
          setLicensePlate(e.target.value.toUpperCase());
          setErrors((prev) => ({ ...prev, licensePlate: '' }));
        }}
        error={errors.licensePlate}
        placeholder="B 123 ABC"
        isRequired
      />

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
          onChange={setModel}
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
