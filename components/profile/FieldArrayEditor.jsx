'use client';

function normalizeItem(item, linkMode) {
  if (linkMode) {
    if (
      item &&
      typeof item === 'object'
    ) {
      return {
        label:
          typeof item.label === 'string'
            ? item.label
            : '',
        url:
          typeof item.url === 'string'
            ? item.url
            : '',
      };
    }

    return {
      label: '',
      url:
        typeof item === 'string'
          ? item
          : '',
    };
  }

  return typeof item === 'string'
    ? item
    : '';
}

export default function FieldArrayEditor({
  label,
  value,
  onChange,
  placeholder,
  linkMode = false,
}) {
  const items = Array.isArray(value)
    ? value
    : [];

  function addItem() {
    onChange([
      ...items,
      normalizeItem('', linkMode),
    ]);
  }

  function removeItem(index) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function updateText(index, nextValue) {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? nextValue
          : item
      )
    );
  }

  function updateLink(
    index,
    field,
    nextValue
  ) {
    onChange(
      items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: nextValue,
        };
      })
    );
  }

  return (
    <div className="profile-array-editor">
      <div className="profile-array-heading">
        <span>{label}</span>

        <button
          type="button"
          className="secondary-button"
          onClick={addItem}
        >
          + Add
        </button>
      </div>

      <div className="profile-array-list">
        {items.length === 0 && (
          <p className="profile-array-empty">
            Nothing added yet.
          </p>
        )}

        {items.map((item, index) => (
          <div
            className="profile-array-item"
            key={index}
          >
            {linkMode ? (
              <div className="profile-array-link-fields">
                <input
                  type="text"
                  value={item?.label || ''}
                  placeholder="Link name"
                  maxLength={100}
                  onChange={(event) =>
                    updateLink(
                      index,
                      'label',
                      event.target.value
                    )
                  }
                />

                <input
                  type="url"
                  value={item?.url || ''}
                  placeholder={placeholder}
                  maxLength={500}
                  onChange={(event) =>
                    updateLink(
                      index,
                      'url',
                      event.target.value
                    )
                  }
                />
              </div>
            ) : (
              <input
                type="text"
                value={
                  typeof item === 'string'
                    ? item
                    : ''
                }
                placeholder={placeholder}
                maxLength={300}
                onChange={(event) =>
                  updateText(
                    index,
                    event.target.value
                  )
                }
              />
            )}

            <button
              type="button"
              className="array-remove-button"
              onClick={() =>
                removeItem(index)
              }
              aria-label={`Remove ${label} item`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}