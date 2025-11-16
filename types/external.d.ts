declare module 'react-simple-maps' {
    type ReactNode = import('react').ReactNode
    type ComponentType<P = any> = import('react').ComponentType<P>

    export const ComposableMap: ComponentType<any>
    export const Geographies: ComponentType<{
        geography: string | object
        children: (props: { geographies: Array<{ rsmKey: string } & Record<string, unknown>> }) => ReactNode
    }>
    export const Geography: ComponentType<{
        geography: Record<string, unknown>
        fill?: string
        stroke?: string
        strokeWidth?: number
        className?: string
    }>
    export const Marker: ComponentType<{
        coordinates: [number, number]
        children?: ReactNode
    }>
    export const Line: ComponentType<{
        from: [number, number]
        to: [number, number]
        stroke?: string
        strokeWidth?: number
        strokeLinecap?: string
        strokeDasharray?: string
    }>
}

declare module 'd3-geo' {
    export interface GeoProjection {
        (coordinates: [number, number]): [number, number]
        scale(scale: number): GeoProjection
        center(center: [number, number]): GeoProjection
        translate(translate: [number, number]): GeoProjection
    }

    export function geoMercator(): GeoProjection
}
