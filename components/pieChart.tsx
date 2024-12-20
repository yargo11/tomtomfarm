'use client'

import { fetchCropTypes } from "@/services/cropsService";
import { fetchFarmsFromAPI } from "@/services/farmsService";
import type { CropsProps, FarmsProps } from "@/types";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";

export default function PieCharts() {

    const [farms, setFarms] = useState<FarmsProps[]>([])
    const [cropsList, setCropsList] = useState<CropsProps[]>([])

    useEffect(() => {
        fetchFarmsFromAPI()
            .then(data => setFarms(data))
            .catch(error => console.log(error));

        fetchCropTypes()
            .then(data => setCropsList(data))
            .catch(error => console.log(error));;
    }, []);

    const theCrops: Record<string, string> = {}
    for (const item of cropsList) {
        theCrops[item.id] = item.name
    }

    function groupByCropTypes(farms: FarmsProps[]): Record<number, number> {
        const cropsCount: Record<number, number> = {}

        for (const farm of farms) {
            for (const crop of farm.cropProductions) {
                if (cropsCount[crop.cropTypeId]) {
                    cropsCount[crop.cropTypeId] += 1
                } else {
                    cropsCount[crop.cropTypeId] = 1
                }
            }
        }

        return cropsCount
    }

    const data = Object.entries(groupByCropTypes(farms)).map(([id, value]) => ({
        id,
        label: `${theCrops[id]}`,
        value
    }));

    return (
        <div style={{ height: '400px', width: '600px' }}>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5} // Raio interno para criar um gráfico em forma de anel
                padAngle={0.7} // Espaçamento entre os pedaços
                cornerRadius={3} // Bordas arredondadas
                colors={{ scheme: 'nivo' }} // Esquema de cores
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={true} // Exibe labels de links
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000',
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    )
}