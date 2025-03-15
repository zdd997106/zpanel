import z from '@zpanel/core/schema';
import { DataType, UpdatePortfolioDto } from '@zpanel/core';

// ----------

export const schema = UpdatePortfolioDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  opening: {
    title: '',
    subtitle: '',
    avatar: null as never,
    cv: null as never,
  },
  selectionOfWorks: {
    title: '',
    subtitle: '',
    items: [],
  },
  selectionOfIdeas: {
    title: '',
    subtitle: '',
    items: [],
  },
  services: {
    title: '',
    subtitle: '',
    items: [],
  },
  aboutMe: {
    title: '',
    content: '',
  },
  contact: {
    title: '',
    subtitle: '',
  },
};

export const initialSelectionItem: DataType.Portfolio.ProjectDto = {
  title: '',
  role: '',
  description: '',
  img: null as never,
  link: {
    website: '',
    github: '',
  },
};

export const initialServiceItem: DataType.Portfolio.ServiceDto = {
  title: '',
  description: '',
  icon: '',
};
