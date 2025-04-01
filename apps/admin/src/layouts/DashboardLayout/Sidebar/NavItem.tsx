'use client';

import { get, includes } from 'lodash';
import { mixins } from 'gexii/theme';
import {
  Collapse,
  collapseClasses,
  Fade,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  Stack,
  styled,
  SvgIcon,
  Typography,
} from '@mui/material';

import Icons from 'src/icons';

import { sidebarConfig } from '../configs';

// ----------

export interface NavItemProps extends Omit<ListItemButtonProps, 'title'> {
  variant: EVariant;
  selected?: boolean;
  active?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactElement;
  canExpand?: boolean;
}

export default function NavItem({
  variant = EVariant.NORMAL,
  icon,
  title,
  description,
  selected,
  canExpand,
  active,
  sx,
  ...props
}: NavItemProps) {
  // --- FUNCTIONS ---

  const isNormal = () => includes([EVariant.NORMAL], variant);
  const isIconMode = () => variant === EVariant.ICON;

  // --- ELEMENTS SECTIONS ---

  const sections = {
    iconTitle: (
      <Collapse
        in={variant === EVariant.ICON}
        orientation="vertical"
        unmountOnExit
        sx={{
          [`.${collapseClasses.wrapperInner}`]: {
            // [NOTE] the default display is 'block' which will show a unknown extra space
            // so we need to change it to 'flex' to remove the extra space
            display: 'flex',
          },
        }}
      >
        <Typography
          variant="caption"
          fontSize={10}
          fontWeight={600}
          textAlign="center"
          sx={mixins.ellipse()}
        >
          {title}
        </Typography>
      </Collapse>
    ),

    details: (
      <Stack direction="column">
        <Typography variant="subtitle2" sx={{ ...mixins.ellipse(), color: 'inherit' }}>
          {title}
        </Typography>

        <Typography
          variant="caption"
          color={selected ? 'primary.dark' : 'text.primary'}
          sx={{ ...mixins.ellipse(), opacity: 0.5 }}
        >
          {description}
        </Typography>
      </Stack>
    ),

    expandIcon: (
      <NavigatorIconRoot iconMode={isIconMode()}>
        <Icons.Forward sx={{ rotate: active ? '90deg' : '0deg' }} />
      </NavigatorIconRoot>
    ),
  };

  return (
    <StyledListItem
      {...props}
      color={findTextColor({ active, selected })}
      active={active}
      selected={selected}
      sx={mixins.combineSx({ padding: 0 }, sx)}
    >
      <IconRoot iconMode={isIconMode()} direction="column">
        {icon ?? <SvgIcon />}
        {sections.iconTitle}
      </IconRoot>

      <ListItemText
        sx={{
          width: 0, // take 0 basis inside flexbox
          marginLeft: -1, // fix position
        }}
      >
        <Fade in={isNormal()}>{sections.details}</Fade>
      </ListItemText>

      {canExpand && <>{sections.expandIcon}</>}
    </StyledListItem>
  );
}

// ----- TYPES -----

const EVariant = {
  NORMAL: 'normal',
  ICON: 'icon',
} as const;
type EVariant = (typeof EVariant)[keyof typeof EVariant];

// ----- STYLED -----

const shouldForwardProp = (prop: string) => !includes(['active', 'iconMode'], prop);

export const StyledListItem = styled(ListItemButton, { shouldForwardProp })<
  Pick<NavItemProps, 'active'>
>(({ theme, color, active, selected }) => [
  {
    color: color
      ? get(theme.palette, color)
      : get(theme.palette, findTextColor({ active, selected })),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(sidebarConfig.itemSpacing),
  },
  active && {
    '&': { backgroundColor: theme.palette.action.selected },
    '&:hover': { backgroundColor: theme.palette.action.focus },
  },
]);

const IconRoot = styled(Stack, { shouldForwardProp })<{ iconMode: boolean }>(
  ({ theme, iconMode }) => ({
    color: 'inherit',
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: sidebarConfig.iconWidth,
    height: getItemHeight({ iconMode }),
    transition: theme.transitions.create(['height']),

    svg: {
      fontSize: iconMode ? '1.5em' : '1.75em',
      transition: theme.transitions.create(['font-size']),
    },
  }),
);

const NavigatorIconRoot = styled(Stack, { shouldForwardProp })<{ iconMode: boolean }>(
  ({ theme, iconMode }) => [
    {
      transition: theme.transitions.create(['translate', 'padding']),

      svg: {
        fontSize: iconMode ? '.5em' : '.8em',
        transition: theme.transitions.create('font-size'),
      },
    },

    !iconMode && { paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) },
  ],
);

// ----- HELPER FUNCTIONS -----

function getItemHeight({ iconMode }: { iconMode: boolean }) {
  return iconMode ? sidebarConfig.collapsedItemHeight : sidebarConfig.expandedItemHeight;
}

function findTextColor({ selected = false, active = false }) {
  if (selected) return 'primary.main';
  if (active) return 'text.primary';
  return 'text.secondary';
}
