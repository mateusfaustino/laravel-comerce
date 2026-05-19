import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TagPickerValue {
    /** Existing tag id (number) or new tag description (string). */
    id?: number;
    description: string;
}

interface Suggestion {
    id: number;
    description: string;
}

interface TagPickerProps {
    value: TagPickerValue[];
    onChange: (next: TagPickerValue[]) => void;
    /** API endpoint that returns { data: {id, description}[] } when querying ?q=term. */
    searchEndpoint?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

/**
 * Normalize the same way the backend does: lowercase + trim + collapse whitespace.
 */
function normalize(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * TagPicker: autocomplete + create-on-the-fly multi-tag input.
 *
 * - Type to search existing tags (debounced 250ms).
 * - Press Enter or click "Adicionar" to add the typed term as a NEW tag (folksonomy).
 * - Click an existing suggestion to attach it.
 * - Selected tags appear as removable chips.
 *
 * Accessibility: input is aria-labeled, suggestions list is keyboard-friendly,
 * remove buttons are reachable by keyboard.
 */
export function TagPicker({
    value,
    onChange,
    searchEndpoint = '/admin/tags/search',
    placeholder = 'Digite para buscar ou criar uma tag...',
    error,
    disabled = false,
}: TagPickerProps) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [searching, setSearching] = useState(false);
    const [open, setOpen] = useState(false);
    const debounceRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const term = input.trim();
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
        }
        if (term === '') {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        debounceRef.current = window.setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(
                    `${searchEndpoint}?q=${encodeURIComponent(term)}&limit=10`,
                    { headers: { Accept: 'application/json' } },
                );
                if (res.ok) {
                    const json = await res.json().catch(() => null);
                    if (json && Array.isArray(json.data)) {
                        setSuggestions(json.data as Suggestion[]);
                        setOpen(true);
                    }
                }
            } catch {
                setSuggestions([]);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
            }
        };
    }, [input, searchEndpoint]);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const isSelected = (descriptionOrId: { id?: number; description: string }) => {
        const norm = normalize(descriptionOrId.description);
        return value.some((v) => {
            if (descriptionOrId.id !== undefined && v.id === descriptionOrId.id) {
                return true;
            }
            return normalize(v.description) === norm;
        });
    };

    const addTag = (tag: TagPickerValue) => {
        if (!isSelected(tag)) {
            onChange([...value, tag]);
        }
        setInput('');
        setSuggestions([]);
        setOpen(false);
    };

    const removeAt = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleAddTyped = () => {
        const normalized = normalize(input);
        if (normalized === '') {
            return;
        }
        addTag({ description: normalized });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTyped();
        } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
            removeAt(value.length - 1);
        }
    };

    return (
        <div className="flex flex-col gap-2" ref={containerRef}>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2" aria-label="Tags selecionadas">
                    {value.map((tag, i) => (
                        <Badge key={`${tag.id ?? 'new'}-${tag.description}-${i}`} variant="secondary" className="gap-1 pr-1">
                            <span>{tag.description}</span>
                            <button
                                type="button"
                                onClick={() => removeAt(i)}
                                className="ml-1 rounded hover:bg-muted-foreground/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                                aria-label={`Remover tag ${tag.description}`}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <div className="relative">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => input.trim() !== '' && setOpen(true)}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-label="Buscar ou criar tag"
                        autoComplete="off"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTyped}
                        disabled={disabled || normalize(input) === ''}
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Adicionar
                    </Button>
                </div>

                {open && (suggestions.length > 0 || searching) && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                        {searching && (
                            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Buscando...
                            </div>
                        )}
                        {suggestions.map((s) => {
                            const selected = isSelected(s);
                            return (
                                <button
                                    type="button"
                                    key={s.id}
                                    onClick={() => addTag({ id: s.id, description: s.description })}
                                    disabled={selected}
                                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                                >
                                    <span className="truncate">{s.description}</span>
                                    {selected && <span className="text-xs text-muted-foreground">selecionada</span>}
                                </button>
                            );
                        })}
                        {!searching && suggestions.length === 0 && input.trim() !== '' && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Nenhuma tag encontrada. Pressione Enter para criar.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-muted-foreground">
                Pressione Enter para criar uma nova tag. Tags sao normalizadas (minusculas, espacos colapsados).
            </p>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
