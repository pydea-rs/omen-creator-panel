import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import type { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  value: number;
  onChange: (categoryId: number, categoryName: string) => void;
  disabled: boolean;
}

interface CategoryMenuProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  selectedId: number;
  level: number;
}

function CategoryMenu({ categories, onSelect, selectedId, level }: CategoryMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number } | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (category: Category, id: number) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (category.subCategories && category.subCategories.length > 0) {
      setHoveredCategory(category);
      const element = itemRefs.current[id];
      if (element) {
        const rect = element.getBoundingClientRect();
        setSubmenuPosition({
          top: rect.top - 8, // Slight offset to align better
          left: rect.right + 4 // Small gap between menus
        });
      }
    } else {
      setHoveredCategory(null);
      setSubmenuPosition(null);
    }
  };

  const handleMouseLeave = () => {
    // Add a small delay before hiding the submenu
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setSubmenuPosition(null);
    }, 150);
  };

  const handleSubmenuMouseEnter = () => {
    // Clear timeout when entering submenu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleSubmenuMouseLeave = () => {
    setHoveredCategory(null);
    setSubmenuPosition(null);
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-lg border-2 border-slate-200 py-2 min-w-64 max-h-96 overflow-y-auto ${level === 0 ? 'relative' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            ref={(el) => (itemRefs.current[category.id] = el)}
            type="button"
            onMouseEnter={() => handleMouseEnter(category, category.id)}
            onClick={() => {
              if (!category.subCategories || category.subCategories.length === 0) {
                onSelect(category);
              }
            }}
            className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${selectedId === category.id ? 'bg-blue-100 text-blue-700' : 'text-slate-700'
              }`}
          >
            <span className="flex items-center gap-2">
              {selectedId === category.id && <Check className="w-4 h-4" />}
              {category.name}
            </span>
            {category.subCategories && category.subCategories.length > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
            {/* Debug: Show subcategory count */}
            {category.subCategories && category.subCategories.length > 0 && (
              <span className="text-xs text-red-500 ml-1">({category.subCategories.length})</span>
            )}
          </button>
        ))}
      </div>
      {hoveredCategory && hoveredCategory.subCategories && hoveredCategory.subCategories.length > 0 && submenuPosition && (
        <div
          className="fixed z-[60]"
          style={{
            top: submenuPosition.top,
            left: submenuPosition.left,
            pointerEvents: 'auto'
          }}
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
        >
          <CategoryMenu
            categories={hoveredCategory.subCategories}
            onSelect={onSelect}
            selectedId={selectedId}
            level={level + 1}
          />
        </div>
      )}
    </>
  );
}

function CategorySelector({ categories, value, onChange, disabled }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findCategoryName = (cats: Category[], id: number): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.subCategories) {
          const found = findCategoryName(cat.subCategories, id);
          if (found) return found;
        }
      }
      return '';
    };

    if (value) {
      setSelectedName(findCategoryName(categories, value));
    }
  }, [value, categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (category: Category) => {
    onChange(category.id, category.name);
    setSelectedName(category.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-left bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
      >
        {selectedName || 'Select a category...'}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <CategoryMenu
            categories={categories}
            onSelect={handleSelect}
            selectedId={value}
            level={0}
          />
        </div>
      )}
    </div>
  );
}

export default CategorySelector;
