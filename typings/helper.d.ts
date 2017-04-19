import * as stream from 'stream';
import { AssetResource } from './resources/datamanager/AssetResource';
type environment = 'live' | 'stage' | 'nightly' | 'develop';

export function get(environment: environment, t: any): Promise<any>;

export function getEmpty(environment: environment, t: any): Promise<void>;

export function postEmpty(environment: environment, t: any, body: any): Promise<void>;

export function getUrl(environment: environment, t: any): Promise<string>;

export function post(environment: environment, t: any, body: any): Promise<any>;

export function put(environment: environment, t: any, body: any): Promise<any>;

export function del(environment: environment, t: any): Promise<any>;

export function superagentFormPost(url: string, form: any): Promise<string>;

export function superagentGet(url: string, headers: any): Promise<any>;

export function superagentGetPiped(url: string, pipe: stream.Writable): Promise<void>;

export function superagentPost(environment: environment, request: any): Promise<any>;

export function optionsToQuery(t: any): any;

export function fileNegotiate(asset: AssetResource, image: boolean, thumb: boolean, size: number, requestedLocale: string): string;
