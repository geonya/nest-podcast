import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}

  async getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find();
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    await this.podcasts.save(
      this.podcasts.create({
        title,
        category,
        rating: 0,
        episodes: [],
      }),
    );
    return { ok: true, error: null };
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    const podcast = await this.podcasts.findOne({ where: { id } });
    if (!podcast) {
      return {
        ok: false,
        error: 'not found podcast',
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({ where: { id } });
    if (!podcast) {
      return {
        ok: false,
        error: 'not found podcast',
      };
    }
    await this.podcasts.delete(id);
    return { ok: true };
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const { title, category, episodes, rating } = rest;
    const podcast = await this.podcasts.findOne({ where: { id } });
    if (!podcast) {
      return {
        ok: false,
        error: 'not found podcast',
      };
    }
    if (title) {
      podcast.title = title;
    }
    if (category) {
      podcast.category = category;
    }
    if (episodes) {
      podcast.episodes = episodes;
      episodes.map((episode) => this.episodes.create(episode));
    }
    if (rating) {
      podcast.rating = rating;
    }
    await this.podcasts.save(podcast);
    return {
      ok: true,
    };
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const podcast = await this.podcasts.findOne({ where: { id: podcastId } });
    if (!podcast)
      return {
        ok: false,
        error: 'Not found Podcast',
      };
    const episodes = (await this.podcasts.findOne({ where: { id: podcastId } }))
      .episodes;
    if (!episodes) {
      return {
        ok: false,
        error: 'Not found episode',
      };
    }
    return { ok: true, episodes };
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({ where: { id: podcastId } });
    if (!podcast)
      return {
        ok: false,
        error: 'Not found Podcast',
      };
    await this.episodes.save(this.episodes.create({ title, category }));
    return { ok: true };
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    const podcast = await this.podcasts.findOne({ where: { id: podcastId } });
    if (!podcast)
      return {
        ok: false,
        error: 'Not found Podcast',
      };
    const episode = await this.podcasts.findOne({ where: { id: episodeId } });
    if (!episode)
      return {
        ok: false,
        error: 'Not found Episode',
      };
    await this.episodes.delete(episodeId);
    return { ok: true };
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    const { title, category } = rest;
    const podcast = await this.podcasts.findOne({ where: { id: podcastId } });
    if (!podcast)
      return {
        ok: false,
        error: 'Not found Podcast',
      };
    const episode = await this.podcasts.findOne({ where: { id: episodeId } });
    if (!episode)
      return {
        ok: false,
        error: 'Not found Episode',
      };
    if (title) {
      episode.title = title;
    }
    if (category) {
      episode.category = category;
    }
    await this.episodes.save(episode);
    return { ok: true };
  }
}
