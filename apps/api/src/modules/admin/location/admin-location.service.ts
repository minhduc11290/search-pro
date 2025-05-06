import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AttachmentEntity, LocationEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import axios from 'axios';

@Injectable()
export class AdminLocationService {
  public defaultPopulate: AutoPath<LocationEntity, any> = [
    'store',
    'geoRef',
    'attachments'
  ] as never[];
  constructor(private readonly em: EntityManager) { }

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findById(id: string, populate?: string[]) {
    return await this.em.findOne(
      LocationEntity,
      { id },
      { populate: this.getPopulates(populate) },
    );
  }

  async findAll(populate?: string[]): Promise<LocationEntity[]> {
    return this.em.find(
      LocationEntity,
      {},
      { populate: this.getPopulates(populate) },
    );
  }

  async findByCondition(
    condition: FilterQuery<LocationEntity>,
    populate?: string[],
  ): Promise<LocationEntity[]> {
    return this.em.find(LocationEntity, condition, {
      populate: this.getPopulates(populate),
      orderBy: { createdAt: 'DESC' }
    });
  }

  async create(
    locationData: RequiredEntityData<LocationEntity>,
    attachments?: AttachmentDto[]
  ): Promise<LocationEntity> {

    const location = this.em.create(LocationEntity, locationData);
    if (attachments) {
      const locationAttachments = attachments.map((attachment) =>
        this.em.create(AttachmentEntity, {
          name: attachment.name,
          type: '',
          url: attachment.url,
          location: location,
        }),
      );
      await this.em.persistAndFlush(locationAttachments);
    }
    await this.em.persistAndFlush(location);
    return location;
  }

  async update(
    id: string,
    updateLocationDto: Partial<LocationEntity>,
  ): Promise<LocationEntity> {
    const location = await this.em.findOneOrFail(LocationEntity, id);
    location.assign(updateLocationDto);
    await this.em.persistAndFlush(location);
    return location;
  }

  async softDelete(id: string): Promise<void> {
    const location = await this.em.findOneOrFail(LocationEntity, id);
    location.status = LocationStatus.INACTIVE;
    await this.em.persistAndFlush(location);
  }


  // async deleteAttachment(
  //   id: string
  // ): Promise<void> {
  //   await this.em.nativeDelete(AttachmentEntity, {
  //     id
  //   });
  // }

  async addAttachment(locationId: string, attachments: AttachmentDto[]): Promise<AttachmentEntity[]> {
    let location = await this.findById(locationId);

    const productAttachments = attachments.map((attachment) =>
      this.em.create(AttachmentEntity, {
        name: attachment.name,
        type: '',
        url: attachment.url,
        location: location,
      }),

    );
    await this.em.persistAndFlush(productAttachments);
    return productAttachments;
  }

  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  async getLatLng(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await axios.get(this.NOMINATIM_URL, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      });

      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        };
      }
      return {
        lat: 0,
        lng: 0
      };
    } catch (error) {
      console.error('Nominatim API error:', error);
      return {
        lat: 0,
        lng: 0
      };
    }
  }

}
