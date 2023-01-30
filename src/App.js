import React from 'react';
import {Map} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {ArcLayer} from '@deck.gl/layers';
import dataJson from './data.json'
import dataArc from './dataArc.json'
import { Geometry } from '@luma.gl/core'
import catObj from './12221_Cat_v1_l3.obj'
import texture from "./Cat_diffuse.jpg";
import {OBJLoader} from '@loaders.gl/obj';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2VycHJvazEzMzciLCJhIjoiY2xkaHk1YjdhMDRoZzN1bnl2ZGg1OWY5OCJ9.QG6Jw512VYY_-hh-eZtZ1w"

const DATA_URL = dataJson;
const DATA_URL1 = dataArc;


const INITIAL_VIEW_STATE = {
    longitude: 20.51095,
    latitude: 54.70649,
    zoom: 9,
    maxZoom: 16,
    pitch: 50,
    bearing: 0
};


export default function App({
                                intensity = 1,
                                threshold = 0.03,
                                radiusPixels = 30,
                            }){

    const layers = [
        new HeatmapLayer({
            data: DATA_URL,
            id: 'heatmp-layer-custom',
            pickable: false,
            getPosition: d => [d[0], d[1]],
            getWeight: d => d[2],
            radiusPixels,
            intensity,
            threshold
        }),

        new ArcLayer({
            id: 'arc-layer',
            data: DATA_URL1,
            pickable: true,
            getWidth: 12,
            getSourcePosition: d => d.from.coordinates,
            getTargetPosition: d => d.to.coordinates,
            getSourceColor: d => [Math.sqrt(d.inbound), 140, 0],
            getTargetColor: d => [Math.sqrt(d.outbound), 140, 0],
        }),

        new SimpleMeshLayer({
            id: 'mesh-layer',
            data: [
                {
                         position: [20.529978, 54.715662],
                         angle: 360,
                         color: [245, 206, 108]
                }
            ],
            sizeScale: 20,
            mesh: catObj,
            loaders: [OBJLoader],
            getPosition: d => d.position,
            getColor: d => d.color,
            getOrientation: d => [0, d.angle, 0],
        })
    ];


    return(
        <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}>
            <Map
                INITIAL_VIEW_STATE
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                mapStyle={'mapbox://styles/mapbox/streets-v12'}
            />
        </DeckGL>
    );
}