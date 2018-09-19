export interface FsRoutesOptions {
  glob?: string
  indexFileRegExp?: RegExp
}

export interface FsRoute {
  path: string
  route: string
}
