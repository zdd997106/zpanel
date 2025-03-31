'use client';

import { forwardRef } from 'react';
import { noop } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataType } from '@zpanel/core';
import { resolveMedia } from '@zpanel/ui/utils';
import { useForm } from 'react-hook-form';
import { useAction } from 'gexii/hooks';
import { Field, Form } from 'gexii/fields';
import { Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';

import { api, ServiceError } from 'src/service';

import { FieldValues, initialValues, schema } from './schema';
import { DocumentField, ImageField } from './components';
import Sections from './sections';

// ----------

export interface PortfolioFormProps {
  defaultValues?: FieldValues;
  onSubmit?: (submission: Promise<unknown>) => void;
  onSubmitError?: (error: Error) => void;
}

export default forwardRef(function PortfolioForm(
  { defaultValues = initialValues, onSubmit = noop, onSubmitError = noop }: PortfolioFormProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const methods = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // --- PROCEDURE ---

  const resolveUnsyncedMedia = useAction(async () => {
    const values = methods.getValues();
    await resolveMedia.byPath(values, 'opening.avatar');
    await resolveMedia.byPath(values, 'opening.cv');
    await resolveMedia.list(
      values.selectionOfIdeas.items
        .map((item) => item.img as DataType.UnsyncedMediaDto)
        .concat(values.selectionOfWorks.items.map((item) => item.img as DataType.UnsyncedMediaDto)),
    );
  });

  const procedure = useAction(
    async () => {
      await resolveUnsyncedMedia.call();
      await methods.handleSubmit(api.updatePortfolio)();
    },
    {
      onError: (error) => {
        if (error instanceof ServiceError && error.hasFieldErrors()) {
          return error.emitFieldErrors(methods);
        }
        onSubmitError(error);
      },
    },
  );

  // --- ELEMENT SECTIONS ---

  let index = 1;
  const sections = {
    opening: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) Opening</Typography>
        </Grid>
        <Sections.Titles name="opening" />
        <Grid>
          <Field label="Avatar" name="opening.avatar">
            <ImageField />
          </Field>
        </Grid>
        <Grid>
          <Field label="CV" name="opening.cv">
            <DocumentField />
          </Field>
        </Grid>
      </Grid>
    ),
    selectionOfWorks: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) Selection Of Works</Typography>
        </Grid>

        <Sections.Titles name="selectionOfWorks" />
        <Sections.Projects name="selectionOfWorks.items" />
      </Grid>
    ),
    selectionOfIdeas: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) Selection Of Ideas</Typography>
        </Grid>

        <Sections.Titles name="selectionOfIdeas" />
        <Sections.Projects name="selectionOfIdeas.items" />
      </Grid>
    ),
    service: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) Services</Typography>
        </Grid>

        <Sections.Titles name="services" />
        <Sections.Services name="services.items" />
      </Grid>
    ),
    aboutMe: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) About Me</Typography>
        </Grid>
        <Grid size={12}>
          <Field label="Title" name="aboutMe.title">
            <TextField variant="standard" fullWidth />
          </Field>
        </Grid>
        <Grid size={12}>
          <Field label="Content" name="aboutMe.content">
            <TextField multiline rows={8} fullWidth sx={{ marginTop: 1 }} />
          </Field>
        </Grid>
      </Grid>
    ),
    contact: (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">({index++}) Contact</Typography>
        </Grid>
        <Sections.Titles name="contact" />
      </Grid>
    ),
  };

  return (
    <Form ref={ref} methods={methods} onSubmit={() => onSubmit(procedure.call())}>
      <Stack spacing={4}>
        {sections.opening}
        {sections.selectionOfWorks}
        {sections.selectionOfIdeas}
        {sections.service}
        {sections.aboutMe}
        {sections.contact}
      </Stack>
    </Form>
  );
});
