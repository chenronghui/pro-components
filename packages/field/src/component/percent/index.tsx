import React, { Fragment, ReactNode, useMemo } from 'react';
import { InputNumber } from 'antd';
import toNumber from 'lodash.tonumber';

import {
  getColorByRealValue,
  getSymbolByRealValue,
  getRealTextWithPrecision,
} from './util';
import { FieldFC } from '../../index';

export interface PercentPropInt {
  prefix?: ReactNode;
  suffix?: ReactNode;
  text?: number | string;
  precision?: number;
  showColor?: boolean;
  showSymbol?: boolean;
}

const FieldPercent: FieldFC<PercentPropInt> = ({
  text,
  prefix,
  precision,
  showSymbol,
  suffix = '%',
  type,
  showColor = false,
  render,
  renderFormItem,
  formItemProps,
}) => {
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [text],
  );

  if (type === 'read') {
    /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */
    const style = showColor ? { color: getColorByRealValue(realValue) } : {};

    const dom = (
      <span style={style}>
        {prefix && <span>{prefix}</span>}
        {showSymbol && (
          <Fragment>{getSymbolByRealValue(realValue)}&nbsp;</Fragment>
        )}
        {getRealTextWithPrecision(realValue, precision)}
        {suffix && suffix}
      </span>
    );
    if (render) {
      return render(
        text,
        { type, ...formItemProps, prefix, precision, showSymbol, suffix },
        dom,
      );
    }
    return dom;
  }
  if (type === 'edit' || type === 'update') {
    const dom = (
      <InputNumber
        formatter={value => {
          if (value && prefix) {
            return `${prefix} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          return value;
        }}
        parser={value =>
          value
            ? value.replace(new RegExp(`\\${prefix}\\s?|(,*)`, 'g'), '')
            : ''
        }
        {...formItemProps}
        defaultValue={realValue}
      />
    );
    if (renderFormItem) {
      return renderFormItem(text, { type, ...formItemProps }, dom);
    }
    return dom;
  }
  return null;
};

export default FieldPercent;