<?php

namespace App\Modules\Authentication\Domain\Entities;

use DateTimeImmutable;

class Role
{
    private ?int $id = null;

    private ?DateTimeImmutable $createdAt = null;

    private ?DateTimeImmutable $updatedAt = null;

    /**
     * @param  array<Permission>  $permissions
     */
    public function __construct(
        private string $slug,
        private string $name,
        private array $permissions = [],
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return array<Permission>
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    /**
     * @param  array<Permission>  $permissions
     */
    public function setPermissions(array $permissions): self
    {
        $this->permissions = $permissions;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
