export default function RoomDetailsSkeleton() {
  return (
    <section className="interior-content" role="status" aria-label="Loading room details">
      <div className="wrap room-details-skeleton">
        <div className="room-skeleton-heading">
          <span className="room-skeleton-line room-skeleton-breadcrumb" />
          <span className="room-skeleton-line room-skeleton-kicker" />
          <span className="room-skeleton-line room-skeleton-title" />
          <span className="room-skeleton-line room-skeleton-description" />
        </div>
        <div className="room-skeleton-gallery" aria-hidden="true">
          <span className="room-skeleton-image room-skeleton-image-main" />
          <span className="room-skeleton-image" />
          <span className="room-skeleton-image" />
          <span className="room-skeleton-image" />
          <span className="room-skeleton-image" />
        </div>
        <div className="room-skeleton-features" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p className="room-skeleton-caption">Loading room photos and details…</p>
      </div>
    </section>
  );
}
