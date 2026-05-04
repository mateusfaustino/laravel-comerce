<?php

namespace App\Modules\ProductManagement\Domain\Entities;

use Carbon\CarbonImmutable;

class Cor
{
    private ?int $id = null;

    private ?CarbonImmutable $createdAt = null;

    private ?CarbonImmutable $updatedAt = null;

    public function __construct(
        private string $nome,
        private string $codRgb,
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }

    public function getCodRgb(): string
    {
        return $this->codRgb;
    }

    public function setCodRgb(string $codRgb): void
    {
        $this->codRgb = $codRgb;
    }

    public function getCreatedAt(): ?CarbonImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(CarbonImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getUpdatedAt(): ?CarbonImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(CarbonImmutable $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
