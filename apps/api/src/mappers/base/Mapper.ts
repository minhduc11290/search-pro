export interface IMapperOptions {
  [key: string]: any;
}

export interface IMapper<
  Source,
  Destination,
  Options extends IMapperOptions = object,
> {
  map(source: Source, options?: Options): Destination;
  mapArray(source: Source[], options?: Options): Destination[];
}

export abstract class Mapper<
  Source,
  Destination,
  Options extends IMapperOptions = object,
> implements IMapper<Source, Destination, Options>
{
  abstract map(source: Source, options?: Options): Destination;

  mapArray(source: Source[], options?: Options): Destination[] {
    return source.map((item) => this.map(item, options));
  }
}
