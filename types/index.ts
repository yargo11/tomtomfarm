import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface FarmsProps {
  id: number;
  farmName: string;
  landArea: number;
  landUnit: string;
  createdAt: string;
  updatedAt: string;
  cropProductions: CropProductionProps[];
}

export interface CropProductionProps {
  id: number;
  cropTypeId: number;
  isIrrigated: boolean;
  isInsured: boolean;
}

export interface CropsProps {
  id: string;
  name: string;
}
