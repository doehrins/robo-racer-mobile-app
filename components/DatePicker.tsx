import React from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DatePickerProps {
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={onChange}
    />
  );
};

export default DatePicker;