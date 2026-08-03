import {
  IconArmchair,
  IconBottle,
  IconBrush,
  IconMoustache,
  IconRazor,
  IconRazorElectric,
  IconScissors,
} from '@tabler/icons-react';

import { DEFAULT_SERVICE_ICON } from '@/constants';
import { ShavingBrushIcon } from '@/components/ServiceIcon/ShavingBrushIcon';

const TABLER_ICONS = {
  scissor: IconScissors,
  clipper: IconRazorElectric,
  razor: IconRazor,
  beard: IconMoustache,
  jar: IconBottle,
  chair: IconArmchair,
  color: IconBrush,
};

const CUSTOM_ICONS = {
  brush: ShavingBrushIcon,
};

export default function ServiceIcon({ icon = DEFAULT_SERVICE_ICON, size = 52, className }) {
  const CustomIcon = CUSTOM_ICONS[icon];
  if (CustomIcon) {
    return <CustomIcon size={size} className={className} />;
  }

  const Icon = TABLER_ICONS[icon] ?? TABLER_ICONS[DEFAULT_SERVICE_ICON];

  return (
    <Icon
      size={size}
      stroke={1.5}
      className={className}
      aria-hidden="true"
    />
  );
}
