import { MediaDto } from './media.data.dto';

export interface PortfolioDto {
  opening: Portfolio.OpeningDto;
  selectionOfWorks: Portfolio.SelectionDto;
  selectionOfIdeas: Portfolio.SelectionDto;
  services: Portfolio.ServicesDto;
  aboutMe: Portfolio.AboutMeDto;
  contact: Portfolio.ContactDto;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Portfolio {
  export interface SectionDto {
    title: string;
    subtitle: string;
  }

  export interface OpeningDto extends Portfolio.SectionDto {
    avatar: MediaDto;
    cv: MediaDto;
  }

  export interface SelectionDto extends Portfolio.SectionDto {
    items: ProjectDto[];
  }

  export interface ServicesDto extends Portfolio.SectionDto {
    items: ServiceDto[];
  }

  export interface AboutMeDto extends Pick<Portfolio.SectionDto, 'title'> {
    content: string;
  }

  export interface ContactDto extends Portfolio.SectionDto {}

  // --- ITEMS ---

  export interface ProjectDto {
    title: string;
    role: string;
    description: string;
    img: MediaDto;
    link?: {
      website?: string;
      github?: string;
    };
  }

  export interface ServiceDto {
    title: string;
    description: string;
    icon: string;
  }

  export interface ParagraphDto {
    title: string;
    content: string;
  }
}
