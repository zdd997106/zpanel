'use client';

import { DataType } from '@zpanel/core';
import { combineCallbacks } from 'gexii/utils';
import { get, noop } from 'lodash';
import { createElement } from 'react';
import { UploadFileOptions, uploadFile, createMedia } from 'src/utils';

// ----------

export interface UploadableOptions<TKey> extends Omit<UploadFileOptions, 'multiple'> {
  /** The name of prop to provide media value. Default with `src`. */
  valueKey?: TKey | (string & {});
}

interface Uploadable<TComponent extends React.ComponentType<any>> {
  (
    props: Omit<React.ComponentProps<TComponent>, 'onChange'> & {
      value?: DataType.MediaDto | DataType.UnsyncedMediaDto | null;
      accept?: string;
      disabled?: boolean;
      onChange?: (media: DataType.UnsyncedMediaDto) => void;
    },
  ): React.ReactElement;
}

export function uploadable<TComponent extends React.ComponentType<any>>(
  Component: TComponent,
  { valueKey, ...options }: UploadableOptions<React.ComponentProps<TComponent>> = {},
): Uploadable<TComponent> {
  return (({ value, onChange: setValue = noop, ...props }) => {
    // --- HANDLERS ---

    const handleClick = async () => {
      const files = await uploadFile({ ...options, accept: props.accept ?? options.accept });
      if (!files || files.length === 0) return;

      setValue(createMedia(files[0]));
    };

    return createElement(Component, {
      ...props,

      // Passes value to center prop if valueKey provided
      ...(valueKey ? { [valueKey]: value && createMedia.url(value) } : null),

      onClick: combineCallbacks(!props.disabled && handleClick, get(props, 'onClick')),
    });
  }) as Uploadable<TComponent>;
}
