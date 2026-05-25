export const serializeUser = (user: any) => ({
  ...user,
  createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
  updatedAt: user.updatedAt?.toISOString?.() ?? user.updatedAt
})

export const serializeThumbnail = (thumbnail: any) => ({
  ...thumbnail,
  createdAt: thumbnail.createdAt?.toISOString?.() ?? thumbnail.createdAt,
  updatedAt: thumbnail.updatedAt?.toISOString?.() ?? thumbnail.updatedAt
})

export const serializeDownload = (download: any) => ({
  ...download,
  downloadedAt: download.downloadedAt?.toISOString?.() ?? download.downloadedAt,
  createdAt: download.createdAt?.toISOString?.() ?? download.createdAt
})
